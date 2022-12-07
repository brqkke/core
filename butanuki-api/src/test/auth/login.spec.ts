import { INestApplication } from '@nestjs/common';
import { RecaptchaService } from '../../services/RecaptchaService';
import { AuthController } from '../../auth/auth.controller';
import request from 'supertest';
import { MailerTransportService } from '../../emails/MailerTransportService';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { useAppWithMockedDatabase } from '../utils';
import { invariant } from 'graphql/jsutils/invariant';

const moduleMocker = new ModuleMocker(global);
describe('AuthController', () => {
  let app: INestApplication;
  const recaptchaService: RecaptchaService = {
    async verifyCaptcha(token: string): Promise<boolean> {
      if (token == 'valid') {
        return true;
      }
      return false;
    },
  } as RecaptchaService;

  const testingModule = useAppWithMockedDatabase();

  beforeAll(async () => {
    invariant(!!testingModule.testingModuleBuilder);
    const moduleRef = await testingModule.testingModuleBuilder
      .overrideProvider(RecaptchaService)
      .useValue(recaptchaService)
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
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should login the user', async () => {
    const transport = app.get(MailerTransportService);

    await request(app.getHttpServer())
      .post('/auth/login/email')
      .send({
        email: 'john@doe.com',
        captchaToken: 'valid',
        locale: 'en',
      })
      .expect({ success: true });
    const mocked = jest.mocked(transport.sendRawEmail);
    expect(mocked).toHaveBeenCalledTimes(1);
    const tempCode = mocked.mock.lastCall[0].content.match(
      /https?:\/\/.+\/login\/verify\/([0-9A-z]+)\/john@doe\.com/,
    )?.[1];
    expect(tempCode).toBeTruthy();
    const verify = await request(app.getHttpServer())
      .post('/auth/login/email/verify')
      .send({
        email: 'john@doe.com',
        tempCode,
      });
    expect(verify.body).toMatchObject({
      success: true,
      user: {
        email: 'john@doe.com',
      },
    });
    expect(verify.body.sessionToken).toBeTruthy();

    const verify2 = await request(app.getHttpServer())
      .post('/auth/login/email/verify')
      .send({
        email: 'john@doe.com',
        tempCode,
      });
    expect(verify2.status).toBe(401);

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', verify.body.sessionToken)
      .send();
    expect(me.body).toMatchObject({
      email: 'john@doe.com',
    });
  });

  it("can't login with invalid captcha", async () => {
    await request(app.getHttpServer())
      .post('/auth/login/email')
      .send({
        email: 'john@doe.com',
        captcha: 'invalid',
        locale: 'en',
      })
      .expect(400)
      .expect({ success: false, error: 'captcha' });
  });

  it('can login without locale', async () => {
    await request(app.getHttpServer())
      .post('/auth/login/email')
      .send({
        email: 'john@doe.com',
        captchaToken: 'valid',
      })
      .expect({ success: true });
  });
});
