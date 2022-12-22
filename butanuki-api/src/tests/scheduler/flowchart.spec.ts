import { makeUser, useAppWithMockedDatabase } from '../utils';
import { ModuleMocker } from 'jest-mock';
import { SchedulerModule } from '../../scheduler/scheduler.module';
import { INestApplication } from '@nestjs/common';
import { User, UserWithToken } from '../../entities/User';
import { BityClientService } from '../../bity/bity.client.service';
import { MockBityService } from '../bity.mock';
import { OrderService } from '../../order/order.service';
import { AuthService } from '../../auth/AuthService';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { CheckPendingOrdersTask } from '../../scheduler/tasks/CheckPendingOrdersTask';
import { RenewFilledOrderTask } from '../../scheduler/tasks/RenewFilledOrderTask';
import { OrderCurrency } from '../../entities/enums/OrderCurrency';
import { Vault } from '../../entities/Vault';
import { VaultInput } from '../../vault/types';
import { OrderTemplateService } from '../../order/order.template.service';
import { OrderStatus } from '../../entities/enums/OrderStatus';
import { MailerTransportService } from '../../emails/MailerTransportService';
import { OrderFrequency } from '../../entities/enums/OrderFrequency';

const moduleMocker = new ModuleMocker(global);
describe('Background process flowchart', () => {
  const mockedAppDB = useAppWithMockedDatabase([SchedulerModule, AppModule], {
    mockEmail: true,
    moduleMocker,
  });
  let app: INestApplication;
  let user: User;
  let sessionToken: string;
  let mockedBityService: MockBityService;
  let vault: Vault;
  beforeAll(async () => {
    const moduleRef = await mockedAppDB
      .testingModuleBuilder!.overrideProvider(BityClientService)
      .useClass(MockBityService)
      .compile();
    app = await moduleRef.createNestApplication().init();
    mockedBityService = moduleRef.get(BityClientService) as MockBityService;
    const orderService = moduleRef.get(OrderService);
    user = await makeUser(mockedAppDB.db!);
    sessionToken = await app
      .get(AuthService)
      .createUserSession(user)
      .then((token) => token.token);
    const mockedRedirectUri = JSON.stringify({ userId: '123' });
    //we create a redirect uri identifying the user with a fake id
    const res1 = await request(app.getHttpServer())
      .post('/api/graphql')
      .set('Authorization', sessionToken)
      .send({
        query: `mutation linkBity($redirectedFrom: String!){
    linkBity(redirectedFrom: $redirectedFrom){ ...BityStatus }
} fragment BityStatus on User { id bityTokenStatus { linked linkStatus } }`,
        variables: {
          redirectedFrom: mockedRedirectUri,
        },
      });
    expect(res1.body.data.linkBity.bityTokenStatus.linked).toBe(true);
    user.token = await mockedAppDB.db?.token.findOneOrFail({
      where: { userId: user.id },
    });

    //create vault
    const res2 = await request(app.getHttpServer())
      .post('/api/graphql')
      .set('Authorization', sessionToken)
      .send({
        query: `mutation addVault($data: VaultInput!){
        addVault(data: $data){
          id
          name
          }
      }`,
        variables: {
          data: {
            currency: OrderCurrency.EUR,
            name: 'test vault',
          } as VaultInput,
        },
      });
    vault = await mockedAppDB.db!.vault.findOneOrFail({
      where: { id: res2.body.data.addVault.id },
    });
  });
  //create order
  //order is checked, noop
  //order becomes paid
  //order is checked, order is set to be renewed
  //order is found to be renewed, order is renewed
  //order is checked, noop
  // done
  it('should renew order', async () => {
    const orderTemplateService = app.get(OrderTemplateService);
    const order = await orderTemplateService.initTemplate(
      user as UserWithToken,
      vault.id,
      {
        name: 'test order',
        amount: 100,
        cryptoAddress: 'bc1q123',
        frequency: OrderFrequency.WEEKLY,
      },
    );
    console.log(order);
    expect(order.newOrder.currency).toBe(OrderCurrency.EUR);
    expect(order.template.currency).toBe(OrderCurrency.EUR);

    const checkTask = await app.get(CheckPendingOrdersTask);
    const renewOrderTask = await app.get(RenewFilledOrderTask);
    await checkTask.run();
    order.newOrder.lastCheckedAt = new Date(0); //force check
    await mockedAppDB.db!.order.save(order.newOrder);
    const remoteOrder = mockedBityService.data.orders.get(
      order.newOrder.remoteId,
    )!;
    remoteOrder.timestamp_executed = new Date().toISOString();
    remoteOrder.output!.amount = '0.1'; //we simulate a paid order

    await checkTask.run();
    const orderAfterCheck = await mockedAppDB.db!.order.findOneOrFail({
      where: { id: order.newOrder.id },
    });
    expect(orderAfterCheck.status).toBe(OrderStatus.FILLED_NEED_RENEW);
    await renewOrderTask.run();
    const orderAfterRenew = await mockedAppDB.db!.order.findOneOrFail({
      where: { id: order.newOrder.id },
    });
    expect(orderAfterRenew.status).toBe(OrderStatus.FILLED);
    const renewingOrder = await mockedAppDB.db!.order.findOneOrFail({
      where: { previousOrderId: order.newOrder.id },
    });
    expect(renewingOrder.id).not.toBe(order.newOrder.id);
    expect(renewingOrder.status).toBe(OrderStatus.OPEN);
    expect(renewingOrder.amount).toBe(order.newOrder.amount);
    expect(renewingOrder.redactedCryptoAddress).toBe(
      order.newOrder.redactedCryptoAddress,
    );
    expect(renewingOrder.orderTemplateId).toBe(order.newOrder.orderTemplateId);
  });

  it("should try to find already renewing order if can't renew because already renewed", async () => {
    const activeOrder = await mockedAppDB.db!.order.findOneOrFail({
      where: { status: OrderStatus.OPEN },
    });
    const previousOrder = await mockedAppDB.db!.order.findOneOrFail({
      where: { id: activeOrder.previousOrderId! },
    });
    await mockedAppDB.db!.order.delete(activeOrder.id); // delete order and try to renew previous one
    previousOrder.status = OrderStatus.FILLED_NEED_RENEW;
    await mockedAppDB.db!.order.save(previousOrder);
    const renewOrderTask = await app.get(RenewFilledOrderTask);
    await renewOrderTask.run();
    const orderAfterRenew = await mockedAppDB.db!.order.findOneOrFail({
      where: { remoteId: activeOrder.remoteId },
    });
    expect(orderAfterRenew.id).not.toBe(previousOrder.id);
    expect(orderAfterRenew.status).toBe(OrderStatus.OPEN);
  });

  it("should set order status to CANCELLED when cancelled on bity's side and send email to re setup", async () => {
    const activeOrder = await mockedAppDB.db!.order.findOneOrFail({
      where: { status: OrderStatus.OPEN },
    });
    activeOrder.lastCheckedAt = new Date(0); //force check
    await mockedAppDB.db!.order.save(activeOrder);

    const remoteOrder = mockedBityService.data.orders.get(
      activeOrder.remoteId,
    )!;
    remoteOrder.timestamp_cancelled = new Date().toISOString();
    const checkTask = await app.get(CheckPendingOrdersTask);
    await checkTask.run();
    const orderAfterCheck = await mockedAppDB.db!.order.findOneOrFail({
      where: { id: activeOrder.id },
    });
    const transport = app.get(MailerTransportService);
    expect(orderAfterCheck.status).toBe(OrderStatus.CANCELLED);

    expect(jest.mocked(transport.sendRawEmail).mock.calls.length).toBe(1);
    const email = jest.mocked(transport.sendRawEmail).mock.calls[0][0];
    expect(email.to).toBe(user.email);
    expect(email.subject).toContain(`[#${activeOrder.transferLabel}]`);
    expect(email.content).toContain(vault.name);
    expect(email.content).toContain('test order');
  });
});
