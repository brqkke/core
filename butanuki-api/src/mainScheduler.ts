import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { AppConfigService } from './config/app.config.service';
import { wait } from './utils';

async function bootstrap(): Promise<void> {
  console.log('Bootstraping');
  const scheduler = await NestFactory.createApplicationContext(SchedulerModule);
  const { config } = scheduler.get(AppConfigService);
  const schedulerService = scheduler.get(SchedulerService);

  const onTerminate: NodeJS.SignalsListener = async (signal) => {
    console.log('Caught', signal);
    await schedulerService.stop();
    process.exit(0);
  };
  //Catch all termination signals
  ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'].forEach((signal) =>
    process.on(signal, onTerminate),
  );
  if (config.backgroundAgent.disable) {
    console.log('Background agent disabled');
    await wait(10 * 1000);
  } else {
    await schedulerService.start();
  }
}

bootstrap();
