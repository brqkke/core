import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useConfigContext } from "../context/ConfigContext";
import { DcaInterval, OrderCurrency } from "../generated/graphql";

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
  withSign = false,
  withCents = true
) => {
  const fullLocale = `${locale}-${locale.toUpperCase()}`;
  if (currency === "btc") {
    return new Intl.NumberFormat(fullLocale, {
      style: "currency",
      currency: "BTC",
      currencyDisplay: "code",
      minimumFractionDigits: withCents ? 8 : 0,
      maximumFractionDigits: withCents ? 8 : 0,
      signDisplay: withSign ? "always" : "auto",
    })
      .format(amount)
      .replace(/BTC/, "₿");
  }
  return new Intl.NumberFormat(fullLocale, {
    style: "currency",
    currency: currency.toUpperCase(),
    signDisplay: withSign ? "always" : "auto",
    maximumFractionDigits: withCents ? undefined : 0,
    minimumFractionDigits: withCents ? undefined : 0,
  })
    .formatToParts(amount)
    .map((part, i) => {
      if (part.type === "group") {
        return "'";
      }
      if (part.type === "decimal") {
        return ".";
      }

      if (part.type === "currency" && i < 2) {
        return part.value + " ";
      }

      return part.value;
    })
    .join("");
};

export const useTranslateFrequency = () => {
  const { t } = useTranslation();
  return (frequency: DcaInterval) => t(`estimator.input.per.${frequency}`);
};
