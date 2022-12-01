import { createContext } from "react";

export const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps
);

export interface ConfigContextProps {
  recaptchaKey: string;
  availableLocales: string[];
  baseUrl: string;
  publicWebsiteBaseUrl: string;
  maxOrdersTemplatesPerVault: number;
  maxVaultsPerUser: number;
}
