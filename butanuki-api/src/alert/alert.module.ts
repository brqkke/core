import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppConfigModule } from '../config/config.module';
import { TelegramService } from './telegram.service';
import { AlertService } from './alert.service';

@Module({
  imports: [HttpModule, AppConfigModule],
  providers: [TelegramService, AlertService],
  exports: [AlertService],
})
export class AlertModule {}
