import { Order } from '../entities/Order';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { OrderStatus } from '../entities/enums/OrderStatus';
import { MailerService } from './MailerService';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerTransportService } from './MailerTransportService';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { MailerModule } from './mailer.module';

const moduleMocker = new ModuleMocker(global);

describe('Email rendering', () => {
  let mailerService: MailerService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MailerModule],
    })
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
    await module.init();
    mailerService = module.get(MailerService);
  });

  it('sends an email with the order label', async () => {
    const order: Order = {
      amount: 10,
      bankDetails: JSON.stringify({
        iban: '1245 1234 1234',
        swift_bic: 'ABCDEF',
        recipient: 'Bity co',
        account_number: '9876543210',
        bank_code: '1234',
        bank_address: '42 space street',
      }),
      redactedCryptoAddress: 'aaa...zzz',
      currency: OrderCurrency.EUR,
      id: '12345',
      createdAt: new Date(),
      updatedAt: new Date(),
      transferLabel: 'bity.com 123456',
      lastCheckedAt: new Date(0),
      status: OrderStatus.OPEN,
      previousOrderId: null,
      remoteId: '123-123-123',
      userId: '123456',
    };
    const transport = module.get(MailerTransportService);
    await mailerService.sendNewOrderEmail(order, 'aa@aaa.com', 'fr');
    expect(jest.mocked(transport.sendRawEmail).mock.calls[0][0]).toMatchObject({
      to: 'aa@aaa.com',
      subject: 'Nouvel ordre Butanuki',
      content: expect.stringContaining(
        '<span>bity.</span><span>com 123456</span>',
      ),
    });

    expect(
      jest.mocked(transport.sendRawEmail).mock.calls[0][0].content,
    ).toContain('1245 1234 1234');
    expect(
      jest.mocked(transport.sendRawEmail).mock.calls[0][0].content,
    ).toContain('aaa...zzz');
    expect(
      jest.mocked(transport.sendRawEmail).mock.calls[0][0].content,
    ).toContain('Voici les détails');

    await mailerService.sendNewOrderEmail(order, 'aa@aaa.com', 'en');
    expect(jest.mocked(transport.sendRawEmail).mock.calls[1][0]).toMatchObject({
      to: 'aa@aaa.com',
      subject: 'New Butanuki order',
      content: expect.stringContaining(
        '<span>bity.</span><span>com 123456</span>',
      ),
    });
    expect(
      jest.mocked(transport.sendRawEmail).mock.calls[1][0].content,
    ).toContain('1245 1234 1234');
    expect(
      jest.mocked(transport.sendRawEmail).mock.calls[1][0].content,
    ).toContain('Here are the details');
  });

  it('send an email for bity relink', async () => {
    const transport = module.get(MailerTransportService);
    await mailerService.sendBityRelink('aa@aaa.com', 'fr');
    expect(
      jest.mocked(transport.sendRawEmail).mock.calls[0][0].content,
    ).toContain('Vous devez le lier à nouveau');

    await mailerService.sendBityRelink('aa@aaa.com', 'en');
    expect(
      jest.mocked(transport.sendRawEmail).mock.calls[1][0].content,
    ).toContain('You need to link it again');
  });
});
