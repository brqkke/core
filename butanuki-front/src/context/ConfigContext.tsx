import { createContext, useContext, useEffect, useState } from "react";
import { get } from "../api/call";
import { useTranslation } from "react-i18next";

interface ConfigContextProps {
  recaptchaKey: string;
  availableLocales: string[];
  baseUrl: string;
  publicWebsiteBaseUrl: string;
}

const ConfigContext = createContext<ConfigContextProps>({
  recaptchaKey: "dummy",
  availableLocales: ["fr", "en"],
  baseUrl: "dummy",
  publicWebsiteBaseUrl: "dummy",
});

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
    console.log("effect config context", "i18n.changeLanguage", locale);
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffect(() => {
    (async () => {
      const r = await get<
        ConfigContextProps & {
          locale: string;
        }
      >("/config", true, { credentials: "include", mode: "no-cors" });
      if (r.response) {
        setConfig(r.response);
        setLocale(r.response.locale);
      } else {
        setConfig(null);
      }
    })();
  }, []);

  if (config === undefined) {
    return <p>Loading</p>;
  }

  if (config === null) {
    return <p>Error, try reloading</p>;
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export function useConfigContext() {
  return useContext(ConfigContext);
}
