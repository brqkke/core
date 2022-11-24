import { createContext, useContext, useEffect, useState } from "react";
import { get } from "../api/call";
import { useTranslation } from "react-i18next";
import { MainLayout } from "../layout/MainLayout";
import { LoadingCard } from "../components/LoadingCard";
import { useEffectOnce } from "../utils/hooks";

interface ConfigContextProps {
  recaptchaKey: string;
  availableLocales: string[];
  baseUrl: string;
  publicWebsiteBaseUrl: string;
  maxOrdersTemplatesPerVault: number;
  maxVaultsPerUser: number;
}

const response = get<
  ConfigContextProps & {
    locale: string;
  }
>("/config", true, {
  credentials: "include",
  mode: "no-cors",
  headers: {
    Accept: "*/*",
  },
});

const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps
);

export function ConfigContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<ConfigContextProps | null | undefined>(
    undefined
  );

  const [locale, setLocale] = useState("fr");
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffectOnce(() => {
    response.then((response) => {
      if (response.response) {
        setConfig(response.response);
        setLocale(response.response.locale);
      } else {
        setConfig(null);
      }
    });
  });

  if (config === undefined) {
    return (
      <MainLayout withoutLocaleChanger>
        <LoadingCard />
      </MainLayout>
    );
  }
  console.log(config);
  if (config === null) {
    return (
      <MainLayout withoutLocaleChanger>
        <p>Error, try reloading</p>
      </MainLayout>
    );
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export function useConfigContext() {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error(
      "useConfigContext must be used inside ConfigContextProvider"
    );
  }
  return ctx;
}
