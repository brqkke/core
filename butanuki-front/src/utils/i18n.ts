import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useConfigContext } from "../context/ConfigContext";
import { OrderCurrency } from "../generated/graphql";

type Pages = "about" | "help" | "tou" | "privacy" | "login" | "root";

export const usePublicPageLink = (): ((key: Pages) => string) => {
  const { t } = useTranslation();
  const { publicWebsiteBaseUrl } = useConfigContext();

  return useCallback(
    (key: Pages) => {
      const fullKey = `nav.links.${key}` as const;
      const path = t(fullKey);
      return `${publicWebsiteBaseUrl}${path}`;
    },
    [t, publicWebsiteBaseUrl]
  );
};

export const formatAmount = (
  amount: number,
  currency: OrderCurrency | "btc",
  locale: "en" | "fr",
  withSign = false
) => {
  switch (currency) {
    case OrderCurrency.Eur:
      return new Intl.NumberFormat(`${locale}-FR`, {
        style: "currency",
        currency: "EUR",
        signDisplay: withSign ? "always" : "auto",
      }).format(amount);
    case OrderCurrency.Chf:
      return new Intl.NumberFormat(`${locale === "fr" ? "ch" : locale}-CH`, {
        style: "currency",
        currency: "CHF",
        signDisplay: withSign ? "always" : "auto",
      }).format(amount);
    case "btc":
      return new Intl.NumberFormat(`${locale}-US`, {
        style: "currency",
        currency: "BTC",
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
        signDisplay: withSign ? "always" : "auto",
      }).format(amount);
  }
};
