import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './app.config.service';
import { DataSource } from 'typeorm';

@Controller()
export class ConfigController {
  constructor(private appConfig: AppConfigService, private db: DataSource) {}

  @Get('/version')
  version() {
    return { version: process.env.APP_VERSION };
  }

  @Get('/status')
  async status() {
    await this.db.query('SELECT 1');
    return { status: 'ok' };
  }

  @Get('/config')
  config() {
    const config = this.appConfig.config;
    return {
      recaptchaKey: config.recaptcha.key,
      locale: 'en', //TODO: use locale cookie if locale is available, or use browser variable
      availableLocales: ['en', 'fr'], //TODO use locales module to infer list of available locales
      baseUrl: config.baseUrl,
      publicWebsiteBaseUrl: config.publicWebsiteBaseUrl,
    };
  }
}
