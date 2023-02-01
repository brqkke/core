import { Controller, Get, Req } from '@nestjs/common';
import { AppConfigService } from './app.config.service';
import { Request } from 'express';
import { I18nService } from '../i18n/i18n.service';

@Controller()
export class ConfigController {
  constructor(private appConfig: AppConfigService, private i18n: I18nService) {}

  @Get('/config')
  config(@Req() req: Request) {
    const config = this.appConfig.config;
    const headerLocale = req.header('Accept-Language');
    console.log('headerLocale', headerLocale);
    const locale = this.i18n.isLanguageSupported(req.cookies?.locale)
      ? req.cookies.locale
      : 'fr';
    return {
      recaptchaKey: config.recaptcha.key,
      locale, //TODO: use browser locale
      availableLocales: this.i18n.getLanguages(),
      baseUrl: config.baseUrl,
      publicWebsiteBaseUrl: config.publicWebsiteBaseUrl,
      maxOrdersTemplatesPerVault: config.vault.maxOrdersTemplatesPerVault,
      maxVaultsPerUser: config.vault.maxVaultsPerUser,
    };
  }
}
