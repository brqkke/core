import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const translations = require("./locales");
export default function i18ninit() {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: Object.entries(translations).reduce(
        (allLocales, [locale, translation]) => {
          return {
            ...allLocales,
            [locale]: { translation },
          };
        },
        {}
      ),
      lng: "en",
      fallbackLng: "en",

      interpolation: {
        escapeValue: false,
      },
    });
}

i18ninit();