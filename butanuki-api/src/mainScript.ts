import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommandModule } from './command/command.module';
import { CommandService } from './command/command.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const commandName = process.argv[2];
  const commandArgs = process.argv.slice(3);
  console.log({ commandName, commandArgs });

  await app
    .select(CommandModule)
    .get(CommandService)
    .run(commandName, commandArgs);
}
bootstrap();
