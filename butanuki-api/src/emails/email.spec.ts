import { Order } from '../entities/Order';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { OrderStatus } from '../entities/enums/OrderStatus';
import { MailerService } from './MailerService';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerTransportService } from './MailerTransportService';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { SSRService } from './SSRService';

const moduleMocker = new ModuleMocker(global);

describe('Send new order email', () => {
  let mailerService: MailerService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [MailerService],
    })
      .useMocker((token) => {
        if (token === MailerTransportService) {
          return { sendRawEmail: jest.fn() };
        }
        if (token === SSRService) {
          return new SSRService();
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
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
    await mailerService.sendNewOrderEmail(order, 'aa@aaa.com');
    expect(
      jest.mocked(transport.sendRawEmail).mock.calls[0][0],
    ).toMatchSnapshot();
  });
});
