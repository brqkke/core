import "i18next";
import * as ns from "./fr.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "ns";
    // custom resources type
    resources: {
      ns: typeof ns;
    };
  }
}
