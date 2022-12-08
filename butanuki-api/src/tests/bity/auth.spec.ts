import { makeUser, useAppWithMockedDatabase } from '../utils';
import { BityClientService } from '../../bity/bity.client.service';
import { MockBityService } from '../bity.mock';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../entities/User';
import request from 'supertest';
import { AuthService } from '../../auth/AuthService';
import { BityService } from '../../bity/bity.service';
import { MailerTransportService } from '../../emails/MailerTransportService';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { ErrorType } from '../../error/ErrorTypes';
import { TokenStatus } from '../../entities/enums/TokenStatus';

const moduleMocker = new ModuleMocker(global);
describe('Bity auth', () => {
  const testing = useAppWithMockedDatabase();
  let app: INestApplication;
  let user: User;
  let sessionToken: string;
  let mockedBityService: MockBityService;
  beforeAll(async () => {
    const moduleRef = await testing
      .testingModuleBuilder!.overrideProvider(BityClientService)
      .useClass(MockBityService)
      .overrideProvider(MailerTransportService)
      .useFactory({
        factory: () => {
          const mockMetadata = moduleMocker.getMetadata(
            MailerTransportService,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        },
      })
      .compile();
    mockedBityService = moduleRef.get(BityClientService) as MockBityService;
    app = await moduleRef.createNestApplication().init();
    user = await makeUser(testing.db!);
    sessionToken = await app
      .get(AuthService)
      .createUserSession(user)
      .then((token) => token.token);
  });
  it('can get new token for user', async () => {
    const mockedRedirectUri = JSON.stringify({ userId: '123' });
    //we create a redirect uri identifying the user with a fake id
    const res = await request(app.getHttpServer())
      .post('/api/graphql')
      .set('Authorization', sessionToken)
      .send({
        query: `mutation linkBity($redirectedFrom: String!){
    linkBity(redirectedFrom: $redirectedFrom){
        ...BityStatus
    }
}
fragment BityStatus on User {
  id
  bityTokenStatus {
    linked
    linkStatus
  }
}`,
        variables: {
          redirectedFrom: mockedRedirectUri,
        },
      });
    expect(res.body.data.linkBity.bityTokenStatus.linked).toBe(true);
  });

  it('refreshes automatically when token is expired', async () => {
    mockedBityService.data.orders.set('abcd', {
      id: 'abcd',
      input: { amount: '5', currency: 'EUR' },
      output: { amount: '5', currency: 'BTC' },
    });
    mockedBityService.data.ordersUsers.set('abcd', '123');
    const token = await testing.db!.token.findOneOrFail({
      where: { userId: user.id },
    });
    const { response, newToken } = await app
      .get(BityService)
      .getBityOrder({ orderId: 'abcd', token });

    expect(response).toMatchObject({
      status: 200,
      data: {
        id: 'abcd',
        input: { amount: '5', currency: 'EUR' },
        output: { amount: '5', currency: 'BTC' },
      },
    });
    expect(newToken.accessToken).toBe(token.accessToken); //Token is still valid
    mockedBityService.tokens.get(token.accessToken)!.accessExpired = true; //Now we make it obsolete
    const order2Result = await app
      .get(BityService)
      .getBityOrder({ orderId: 'abcd', token });
    expect(order2Result.response.data).toMatchObject({
      id: 'abcd',
      input: { amount: '5', currency: 'EUR' },
      output: { amount: '5', currency: 'BTC' },
    }); //We can still get the order because it was refreshed
    expect(order2Result.newToken.accessToken).not.toBe(token.accessToken); //The token was refreshed so it's different

    const updatedToken = await testing.db!.token.findOneOrFail({
      where: { userId: user.id },
    });
    expect(updatedToken.accessToken).not.toBe(token.accessToken);
    expect(updatedToken.refreshToken).not.toBe(token.refreshToken); //Token was refreshed and new tokens were saved
  });

  it('handles multiple concurrent requests with expired tokens', async () => {
    const token = await testing.db!.token.findOneOrFail({
      where: { userId: user.id },
    });
    mockedBityService.tokens.get(token.accessToken)!.accessExpired = true;
    const promises = [];
    for (let i = 0; i < 15; i++) {
      promises.push(
        app.get(BityService).getBityOrder({ orderId: 'abcd', token }),
      );
    }
    const results = await Promise.all(promises);
    results.map((result) => expect(result.response.status).toBe(200));
  }, 5000);

  it("sends an email if the user's token is revoked", async () => {
    const token = await testing.db!.token.findOneOrFail({
      where: { userId: user.id },
    });
    mockedBityService.tokens.get(token.accessToken)!.accessExpired = true;
    mockedBityService.tokens.get(token.accessToken)!.refreshExpired = true; //we can't refresh the token anymore

    await expect(
      app.get(BityService).getBityOrder({ orderId: 'abcd', token }),
    ).rejects.toThrowError(
      new InternalServerErrorException(ErrorType.CantRefreshBityToken),
    );
    const sendRawCall = jest.mocked(
      app.get(MailerTransportService).sendRawEmail,
    ).mock.lastCall;
    expect(sendRawCall[0].content).toContain(
      'Erreur lors du refresh d&#x27;un token',
    );
    expect(sendRawCall[0].content).toContain(token.id);
    expect(sendRawCall[0].content).toContain(user.id);
    const updatedToken = await testing.db!.token.findOneOrFail({
      where: { userId: user.id },
    });
    expect(updatedToken.status).toBe(TokenStatus.NEED_REFRESH_RETRY);
  });
});
