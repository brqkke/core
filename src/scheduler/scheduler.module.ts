import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { TaskModule } from './task.module';
import path from 'path';

@Module({
  imports: [
    TaskModule.registerAsync({ pathName: path.join(__dirname, 'tasks') }),
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
