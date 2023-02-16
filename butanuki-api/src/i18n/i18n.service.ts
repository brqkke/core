import { Injectable } from '@nestjs/common';
import i18next, { i18n, Resource } from 'i18next';

@Injectable()
export class I18nService {
  private cachedI18nInstanceMap = new Map<string, i18n>();

  getInitialI18nStore(): Resource {
    return i18next.services.resourceStore.data;
  }

  getLng(locale: string): i18n {
    if (!this.cachedI18nInstanceMap.has(locale)) {
      this.cachedI18nInstanceMap.set(
        locale,
        i18next.cloneInstance({ lng: locale, ns: 'ns' }),
      );
    }
    return this.cachedI18nInstanceMap.get(locale)!;
  }

  getLanguages(): readonly string[] {
    return Object.keys(i18next.options.resources || {});
  }

  isLanguageSupported(locale: string): boolean {
    return this.getLanguages().includes(locale);
  }

  findBestLanguageFromHeader(header: string): string {
    const languages = this.getLanguages();
    const supportedLanguages = header
      .split(',')
      .map((l) => l.split(';')[0].trim())
      .filter((l) => languages.includes(l));
    return supportedLanguages[0] || 'fr';
  }
}
