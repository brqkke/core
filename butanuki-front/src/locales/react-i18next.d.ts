import "i18next";
import * as translation from "./fr.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "translation";
    // custom resources type
    resources: {
      translation: typeof translation;
    };
  }
}
