import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SchedulerService } from './scheduler/scheduler.service';

async function bootstrap() {
  const scheduler = await NestFactory.createApplicationContext(SchedulerModule);
  scheduler.get(SchedulerService).start();
}
bootstrap();
