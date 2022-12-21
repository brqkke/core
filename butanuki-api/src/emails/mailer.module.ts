import { Module } from '@nestjs/common';
import { MailerService } from './MailerService';
import { SSRService } from './SSRService';
import { MailerTransportService } from './MailerTransportService';
import { AppConfigModule } from '../config/config.module';
import { I18nModule } from '../i18n/i18n.module';
import { EmailController } from './email.controller';

@Module({
  imports: [AppConfigModule, I18nModule.forRootAsync()],
  providers: [MailerService, SSRService, MailerTransportService],
  exports: [MailerService],
  controllers: [EmailController],
})
export class MailerModule {}
