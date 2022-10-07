import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useConfigContext } from "../context/ConfigContext";

export const usePublicPageLink = (): ((key: string) => string) => {
  const { t } = useTranslation();
  const { publicWebsiteBaseUrl } = useConfigContext();

  return useCallback(
    (key: string) => {
      const path = t(`nav.links.${key}`);
      return `${publicWebsiteBaseUrl}${path}`;
    },
    [t, publicWebsiteBaseUrl]
  );
};
