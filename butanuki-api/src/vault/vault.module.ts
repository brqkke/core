import { Module } from '@nestjs/common';
import { VaultService } from './vault.service';
import { VaultResolver } from './vault.resolver';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [OrderModule],
  providers: [VaultService, VaultResolver],
})
export class VaultModule {}
