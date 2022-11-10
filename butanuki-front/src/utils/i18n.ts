import { CustomTypeOptions, useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useConfigContext } from "../context/ConfigContext";
import { OrderCurrency } from "../generated/graphql";

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

export const formatAmount = (
  amount: number,
  currency: OrderCurrency | "btc",
  locale: "en" | "fr"
) => {
  switch (currency) {
    case OrderCurrency.Eur:
      return new Intl.NumberFormat(`${locale}-FR`, {
        style: "currency",
        currency: "EUR",
      }).format(amount);
    case OrderCurrency.Chf:
      return new Intl.NumberFormat(`${locale}-CH`, {
        style: "currency",
        currency: "CHF",
      }).format(amount);
    case "btc":
      return new Intl.NumberFormat(`${locale}-US`, {
        style: "currency",
        currency: "BTC",
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      }).format(amount);
  }
};
