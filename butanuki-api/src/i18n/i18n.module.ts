import { Module, OnModuleInit } from '@nestjs/common';
import { I18nService } from './i18n.service';
import i18next from 'i18next';
import { locales } from './locales';
import { initReactI18next } from 'react-i18next';

export const defaultNS = 'ns';

@Module({ providers: [I18nService], exports: [I18nService] })
export class I18nModule implements OnModuleInit {
  async onModuleInit() {
    const resources = Object.entries(locales).reduce(
      (acc, [locale, translation]) => {
        return { ...acc, [locale]: { [defaultNS]: translation } };
      },
      {},
    );
    await i18next.use(initReactI18next).init({
      lng: 'fr',
      defaultNS,
      resources,
    });
  }
}
