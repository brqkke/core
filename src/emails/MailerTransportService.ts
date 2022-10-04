import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { AppConfigService } from '../config/app.config.service';

@Injectable()
export class MailerTransportService {
  private transporter: Transporter;

  constructor(private appConfig: AppConfigService) {
    this.transporter = this.makeMailTransport();
  }

  makeMailTransport() {
    return createTransport({
      maxConnections: 5,
      pool: true,
      host: this.appConfig.config.email.smtp.host,
      port: this.appConfig.config.email.smtp.port,
      secure: true,
      auth: {
        user: this.appConfig.config.email.smtp.username,
        pass: this.appConfig.config.email.smtp.password,
      },
    });
  }

  public async sendRawEmail({
    to,
    subject,
    content,
  }: {
    to: string;
    subject: string;
    content: string;
  }) {
    //TODO move to queue
    const transport = this.transporter;
    return transport.sendMail({
      from: { name: 'Butanuki', address: 'no-reply@butanuki.com' },
      to,
      subject: `Butanuki - ${subject}`,
      html: content,
    });
  }
}
