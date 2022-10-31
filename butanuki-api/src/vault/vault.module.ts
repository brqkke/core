import { forwardRef, Module } from '@nestjs/common';
import { VaultService } from './vault.service';
import { VaultResolver } from './vault.resolver';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [forwardRef(() => OrderModule)],
  providers: [VaultService, VaultResolver],
  exports: [VaultService],
})
export class VaultModule {}
