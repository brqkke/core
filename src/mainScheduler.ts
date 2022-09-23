import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setInterval(() => console.log('hey'), 2000);
}
bootstrap();
