import { forwardRef, Module } from '@nestjs/common';
import { BityService } from './bity.service';
import { AppConfigModule } from '../config/config.module';
import { HttpModule } from '@nestjs/axios';
import { BityLinkController } from './bity.link.controller';
import { BityOrderController } from './bity.order.controller';
import { OrderModule } from '../order/order.module';
import { BityClientService } from './bity.client.service';
import { MailerModule } from '../emails/mailer.module';

@Module({
  imports: [
    AppConfigModule,
    HttpModule,
    forwardRef(() => OrderModule),
    MailerModule,
  ],
  controllers: [BityOrderController, BityLinkController],
  providers: [BityService, BityClientService],
  exports: [BityService],
})
export class BityModule {}
