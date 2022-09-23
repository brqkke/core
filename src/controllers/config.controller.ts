import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from '../services/ConfigService';

@Controller('config')
export class ConfigController {
  constructor(private appConfig: AppConfigService) {}

  @Get()
  config() {
    const config = this.appConfig.config;
    return {
      recaptchaKey: config.recaptcha.key,
      locale: 'en',
      availableLocales: ['en', 'fr'],
      baseUrl: config.baseUrl,
      publicWebsiteBaseUrl: config.publicWebsiteBaseUrl,
    };
  }
}
