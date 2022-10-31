import { CustomTypeOptions, useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useConfigContext } from "../context/ConfigContext";

type Pages = keyof CustomTypeOptions["resources"]["ns"]["nav"]["links"];

export const usePublicPageLink = (): ((key: Pages) => string) => {
  const { t } = useTranslation();
  const { publicWebsiteBaseUrl } = useConfigContext();

  return useCallback(
    (key: Pages) => {
      //key: "about" | "help" | "tou" | "privacy" | "login" | "root"
      const fullkey = `nav.links.${key}` as const;
      const path = t(fullkey);
      return `${publicWebsiteBaseUrl}${path}`;
    },
    [t, publicWebsiteBaseUrl]
  );
};
