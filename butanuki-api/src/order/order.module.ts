import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { BityModule } from '../bity/bity.module';
import { OrderTemplateService } from './order.template.service';
import { OrderResolver } from './order.resolver';
import { MailerModule } from '../emails/mailer.module';
import { VaultModule } from '../vault/vault.module';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [
    forwardRef(() => BityModule),
    MailerModule,
    VaultModule,
    AppConfigModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderTemplateService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
