import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { MigrateScriptModule } from '../migrate-script/migrate-script.module';

@Module({
  providers: [CommandService],
  imports: [MigrateScriptModule],
})
export class CommandModule {}
