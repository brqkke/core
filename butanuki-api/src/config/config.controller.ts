import { Controller, Get, Req } from '@nestjs/common';
import { AppConfigService } from './app.config.service';
import { Request } from 'express';
import { I18nService } from '../i18n/i18n.service';

@Controller('api/config')
export class ConfigController {
  constructor(private appConfig: AppConfigService, private i18n: I18nService) {}

  @Get('/')
  config(@Req() req: Request) {
    const config = this.appConfig.config;
    const urlLang = req.query.lang?.toString();
    const cookieLang = req.cookies?.locale;
    const headerLang = req.headers['accept-language'];
    const locale =
      !!urlLang && this.i18n.isLanguageSupported(urlLang)
        ? urlLang
        : !!cookieLang && this.i18n.isLanguageSupported(cookieLang)
        ? cookieLang
        : this.i18n.findBestLanguageFromHeader(headerLang || '');
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
