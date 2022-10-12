import { Controller, Get, Req } from '@nestjs/common';
import { AppConfigService } from './app.config.service';
import { Request } from 'express';

const availableLocales = ['fr', 'en'];

@Controller()
export class ConfigController {
  constructor(private appConfig: AppConfigService) {}

  @Get('/config')
  config(@Req() req: Request) {
    const config = this.appConfig.config;
    const locale = availableLocales.includes(req.cookies?.locale)
      ? req.cookies.locale
      : 'en';
    return {
      recaptchaKey: config.recaptcha.key,
      locale, //TODO: use browser locale
      availableLocales: ['en', 'fr'], //TODO use locales module to infer list of available locales
      baseUrl: config.baseUrl,
      publicWebsiteBaseUrl: config.publicWebsiteBaseUrl,
    };
  }
}
