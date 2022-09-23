import { Injectable } from '@nestjs/common';
import { SSRService } from './SSRService';
import { MailerTransportService } from './MailerTransportService';
import { LoginLinkEmailContent } from '../emails/LoginLinkEmailContent';
import { AppConfigService } from './ConfigService';
import React from 'react';
import { BityAccountWasUnlinked } from '../emails/BityAccountWasUnlinked';
import { NewOrderEmailContent } from '../emails/NewOrderEmailContent';

@Injectable()
export class MailerService {
  constructor(
    private renderer: SSRService,
    private transport: MailerTransportService,
    private appConfig: AppConfigService,
  ) {}

  private renderAndSend<P extends {}>({
    to,
    subject,
    element,
    params,
  }: {
    to: string;
    subject: string;
    element: React.FC<P>;
    params: P;
  }) {
    const content = this.renderer.render(element, params);
    return this.transport.sendRawEmail({ to, content, subject });
  }

  sendSingleUseLoginLink(to: string, token: string) {
    return this.renderAndSend({
      to,
      subject: 'Here is your login link',
      element: LoginLinkEmailContent,
      params: {
        url: `${this.appConfig.config.baseUrl}/login/verify/${token}/${to}`,
      },
    });
  }

  sendBityRelink(to: string) {
    return this.renderAndSend({
      to,
      subject: 'It looks like your bity account is no more linked !',
      element: BityAccountWasUnlinked,
      params: {},
    });
  }

  //TODO: make order entity
  async sendNewOrderEmail(order: any, email: string) {
    const bankDetails = JSON.parse(order.bankDetails || '{}') as {
      iban: string;
      swift_bic: string;
      recipient: string;
      account_number: string;
      bank_code: string;
      bank_address: string;
    };
    return this.renderAndSend({
      to: email,
      element: NewOrderEmailContent,
      params: {
        amount: order.amount,
        currency: order.currency,
        redactedCryptoAddress: order.redactedCryptoAddress || '',
        reference: order.transferLabel,
        ...bankDetails,
      },
      subject: 'New Butanuki order',
    });
  }
}
