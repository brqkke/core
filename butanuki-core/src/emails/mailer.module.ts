import { Module } from '@nestjs/common';
import { MailerService } from './MailerService';
import { SSRService } from './SSRService';
import { MailerTransportService } from './MailerTransportService';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [AppConfigModule],
  providers: [MailerService, SSRService, MailerTransportService],
  exports: [MailerService],
})
export class MailerModule {}
