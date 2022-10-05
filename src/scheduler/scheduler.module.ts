import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { DatabaseModule } from '../database/database.module';
import { AppConfigModule } from '../config/config.module';
import { TaskRunner } from './TaskRunner';
import { TestTask } from './TestTask';
import { RetryRefreshTokenTask } from './tasks/RetryRefreshTokenTask';
import { BityModule } from '../bity/bity.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, BityModule],
  providers: [SchedulerService, TaskRunner, TestTask, RetryRefreshTokenTask],
})
export class SchedulerModule {}
