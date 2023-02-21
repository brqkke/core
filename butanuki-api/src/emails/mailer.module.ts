import { Module } from '@nestjs/common';
import { MailerService } from './MailerService';
import { SSRService } from './SSRService';
import { MailerTransportService } from './MailerTransportService';
import { AppConfigModule } from '../config/config.module';
import { I18nModule } from '../i18n/i18n.module';
import { AlertModule } from '../alert/alert.module';

@Module({
  imports: [AppConfigModule, I18nModule, AlertModule],
  providers: [MailerService, SSRService, MailerTransportService],
  exports: [MailerService],
})
export class MailerModule {}
