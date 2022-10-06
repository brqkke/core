import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './app.config.service';

@Controller()
export class ConfigController {
  constructor(private appConfig: AppConfigService) {}

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
