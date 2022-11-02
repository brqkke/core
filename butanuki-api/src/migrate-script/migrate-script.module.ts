import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MigrateScriptService } from './migrate-script.service';

@Module({
  imports: [DatabaseModule],
  providers: [MigrateScriptService],
  exports: [MigrateScriptService],
})
export class MigrateScriptModule {}
