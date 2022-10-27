// import the original type declarations
import "react-i18next";
// import all namespaces (for the default language, only)
import * as ns from "./en.json";

// react-i18next versions lower than 11.11.0
declare module "react-i18next" {
  // and extend them!
  interface Resources {
    ns: typeof ns;
  }
}

// react-i18next versions higher than 11.11.0
declare module "react-i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: "ns";
    // custom resources type
    resources: {
      ns: typeof ns;
    };
  }
}