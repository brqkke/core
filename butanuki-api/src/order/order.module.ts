import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { BityModule } from '../bity/bity.module';
import { OrderTemplateService } from './order.template.service';
import { OrderResolver } from './order.resolver';
import { MailerModule } from '../emails/mailer.module';
import { VaultModule } from '../vault/vault.module';
import { AppConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { OrderFieldResolver } from './order.field.resolver';

@Module({
  imports: [
    forwardRef(() => BityModule),
    MailerModule,
    VaultModule,
    AppConfigModule,
    DatabaseModule,
  ],
  providers: [
    OrderService,
    OrderTemplateService,
    OrderResolver,
    OrderFieldResolver,
  ],
  exports: [OrderService],
})
export class OrderModule {}
