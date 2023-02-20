import { forwardRef, Module } from '@nestjs/common';
import { BityService } from './bity.service';
import { AppConfigModule } from '../config/config.module';
import { HttpModule } from '@nestjs/axios';
import { OrderModule } from '../order/order.module';
import { BityClientService } from './bity.client.service';
import { MailerModule } from '../emails/mailer.module';
import { BityReportingService } from './bity.reporting.service';
import { BityLinkResolver } from './resolvers/bityLinkResolver';
import { BityOrderResolver } from './resolvers/bity.order.resolver';
import { VaultModule } from '../vault/vault.module';

@Module({
  imports: [
    AppConfigModule,
    HttpModule,
    forwardRef(() => OrderModule),
    forwardRef(() => VaultModule),
    MailerModule,
  ],
  providers: [
    BityService,
    BityClientService,
    BityReportingService,
    BityLinkResolver,
    BityOrderResolver,
  ],
  exports: [BityService, BityReportingService],
})
export class BityModule {}
