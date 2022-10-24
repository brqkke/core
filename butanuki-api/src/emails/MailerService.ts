import { Injectable } from '@nestjs/common';
import { SSRService } from './SSRService';
import { MailerTransportService } from './MailerTransportService';
import { LoginLinkEmailContent } from './templates/LoginLinkEmailContent';
import { AppConfigService } from '../config/app.config.service';
import React from 'react';
import { BityAccountWasUnlinked } from './templates/BityAccountWasUnlinked';
import { NewOrderEmailContent } from './templates/NewOrderEmailContent';
import { Order } from '../entities/Order';
import { Token } from '../entities/Token';
import { TokenStatusReporting } from './templates/TokenStatusReporting';

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
    prefix,
  }: {
    to: string;
    subject: string;
    prefix?: string;
    element: React.FC<P>;
    params: P;
  }) {
    const content = this.renderer.render(element, params);
    return this.transport.sendRawEmail({ to, content, subject, prefix });
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
      params: { appUrl: this.appConfig.config.baseUrl },
    });
  }

  async sendNewOrderEmail(order: Order, email: string) {
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

  async sendReportingEmail(content: string) {
    const now = new Date();
    return this.transport.sendRawEmail({
      to: this.appConfig.config.backgroundAgent.reporting.reportingEmail,
      content,
      subject: `Report ${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`,
      prefix: 'BTNK ',
    });
  }

  async sendReportBityRefreshError(token: Token) {
    return this.renderAndSend({
      to: this.appConfig.config.backgroundAgent.reporting.reportingEmail,
      params: { token },
      element: TokenStatusReporting,
      subject: `Bity token refresh error ${token.id}`,
      prefix: '[BTNK Alert] ',
    });
  }
}
