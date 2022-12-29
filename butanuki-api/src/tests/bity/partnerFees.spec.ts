import { ModuleMocker } from 'jest-mock';
import {
  linkBityMock,
  makeUser,
  makeVault,
  useAppWithMockedDatabase,
} from '../utils';
import { SchedulerModule } from '../../scheduler/scheduler.module';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import { User, UserWithToken } from '../../entities/User';
import { MockBityService } from '../bity.mock';
import { Vault } from '../../entities/Vault';
import { BityClientService } from '../../bity/bity.client.service';
import { OrderService } from '../../order/order.service';
import { AuthService } from '../../auth/AuthService';
import { OrderCurrency } from '../../entities/enums/OrderCurrency';
import { OrderTemplateService } from '../../order/order.template.service';
import { OrderFrequency } from '../../entities/enums/OrderFrequency';

const moduleMocker = new ModuleMocker(global);

describe('Partner fees', () => {
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

    user = await makeUser(mockedAppDB.db!);
    vault = await makeVault(mockedAppDB.db!, user.id, OrderCurrency.EUR);
    await linkBityMock(mockedAppDB.db!, user, app);
  });

  it('should create a new order with partner fees', async () => {
    const spy = jest.spyOn(mockedBityService, 'doBityRequest');
    const orderService = app.get(OrderTemplateService);
    const newOrder = await orderService.initTemplate(
      user as UserWithToken,
      vault.id,
      {
        frequency: OrderFrequency.WEEKLY,
        name: 'test',
        amount: 100,
        cryptoAddress: 'bc1q123456789',
      },
    );
    expect(spy.mock.calls[0]).toBeDefined();
    expect(spy.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      endpoint: '/orders',
      body: {
        partner_fee: {
          factor: 0.007,
        },
      },
    });
    spy.mockClear();
    await orderService.updateTemplate(
      user as UserWithToken,
      newOrder.template,
      {
        frequency: OrderFrequency.WEEKLY,
        name: 'test',
        amount: 100,
        cryptoAddress: 'bc1q123456789',
      },
    );
    expect(spy.mock.calls[0]).toBeDefined();
    expect(spy.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      endpoint: '/orders',
      body: {
        partner_fee: {
          factor: 0.007,
        },
      },
    });
    spy.mockRestore();
  });

  it('should override the default partner fees if the user has a custom one', async () => {
    user.customPartnerFee = 0.01;
    await mockedAppDB.db!.user.save(user);
    const spy = jest.spyOn(mockedBityService, 'doBityRequest');
    const orderService = app.get(OrderTemplateService);
    const newOrder = await orderService.initTemplate(
      user as UserWithToken,
      vault.id,
      {
        frequency: OrderFrequency.WEEKLY,
        name: 'test',
        amount: 100,
        cryptoAddress: 'bc1q123456789',
      },
    );

    expect(spy.mock.calls[0]).toBeDefined();
    expect(spy.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      endpoint: '/orders',
      body: {
        partner_fee: {
          factor: 0.01,
        },
      },
    });
    spy.mockClear();
    await orderService.updateTemplate(
      user as UserWithToken,
      newOrder.template,
      {
        frequency: OrderFrequency.WEEKLY,
        name: 'test',
        amount: 100,
        cryptoAddress: 'bc1q123456789',
      },
    );
    expect(spy.mock.calls[0]).toBeDefined();
    expect(spy.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      endpoint: '/orders',
      body: {
        partner_fee: {
          factor: 0.01,
        },
      },
    });
  });
});
