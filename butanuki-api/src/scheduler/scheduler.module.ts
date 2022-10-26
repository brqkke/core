import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { TaskModule } from './task.module';
import path from 'path';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [
    TaskModule.registerAsync({ pathName: path.join(__dirname, 'tasks') }),
    AppConfigModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
