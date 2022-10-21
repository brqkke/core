import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SchedulerService } from './scheduler/scheduler.service';

async function bootstrap(): Promise<void> {
  console.log('Bootstraping');
  const scheduler = await NestFactory.createApplicationContext(SchedulerModule);
  const schedulerService = scheduler.get(SchedulerService);

  const onTerminate: NodeJS.SignalsListener = async (signal) => {
    console.log('Caught', signal);
    await schedulerService.stop();
    process.exit(0);
  };

  process.on('SIGTERM', onTerminate).on('SIGINT', onTerminate);
  await schedulerService.start();
}

bootstrap();
