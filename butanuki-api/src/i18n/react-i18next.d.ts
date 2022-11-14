import 'i18next';
import { fr } from './locales';
import { defaultNS } from './i18n.module';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: { [typeof defaultNS]: typeof fr };
  }
}
