import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { AppConfigService } from '../config/app.config.service';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class MailerTransportService {
  private transporter: Transporter;

  constructor(
    private appConfig: AppConfigService,
    private alertService: AlertService,
  ) {
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
    prefix,
  }: {
    to: string;
    subject: string;
    content: string;
    prefix?: string;
  }) {
    //TODO move to queue
    const fullSubject =
      prefix === undefined ? `Butanuki - ${subject}` : `${prefix}${subject}`;
    const transport = this.transporter;
    try {
      const result = await transport.sendMail({
        from: { name: 'Butanuki', address: 'no-reply@butanuki.com' },
        to,
        subject: fullSubject,
        html: content,
      });
      return result;
    } catch (e: unknown) {
      console.log('Error sending email', e);
      this.alertService
        .send(
          'critical',
          'Error sending email to ' +
            to +
            '\n\n' +
            (typeof e === 'object' && e
              ? e.toString() + '\n\n' + JSON.stringify(e, null, 2)
              : JSON.stringify(e, null, 2)),
          'telegram',
        )
        .catch((err) => {
          console.log('Error sending alert', err);
        });
      throw e;
    }
  }
}
