import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { AppConfigService } from './config/app.config.service';
import { wait } from './utils';
import { AlertService } from './alert/alert.service';

async function bootstrap(): Promise<void> {
  console.log('Bootstraping');
  const scheduler = await NestFactory.createApplicationContext(SchedulerModule);
  const { config } = scheduler.get(AppConfigService);
  const schedulerService = scheduler.get(SchedulerService);
  const alertService = scheduler.get(AlertService);

  let terminateCalled = false;
  const onTerminate: NodeJS.SignalsListener = async (signal) => {
    if (terminateCalled) {
      return;
    }
    terminateCalled = true;
    console.log('Caught', signal);
    alertService
      .send(
        'warning',
        'Stopping background agent ' + process.env.APP_VERSION,
        'telegram',
      )
      .catch((e) => console.error(e));
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
    alertService
      .send(
        'info',
        'Starting background agent ' + process.env.APP_VERSION,
        'telegram',
      )
      .catch((e) => console.error(e));
    await schedulerService.start();
  }
}

bootstrap();
