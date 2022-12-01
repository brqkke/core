import { CurrencyInput, orderCurrencyToSymbol } from "./inputs/CurrencyInput";
import {
  DcaEstimatorConfigFragment,
  DcaInterval,
  ItemType,
  OrderCurrency,
} from "../../generated/graphql";
import { PriceInput } from "./inputs/PriceInput";
import { ItemSelectInput } from "./inputs/ItemSelectInput";
import { FrequencySelectInput } from "./inputs/FrequencySelectInput";
import { DateInput } from "./inputs/DateInput";
import React, { useCallback } from "react";
import { formatAmount } from "../../utils/i18n";
import { Trans, useTranslation } from "react-i18next";
import { EstimatorParams, ResultData } from "./SavingEstimator";
import { FormatToPercent, formatToPercent } from "../PercentageUtils";
import { LoadingCard } from "../LoadingCard";
import { useDebounce } from "../../utils/hooks";
import { useSavingEstimatorConfig } from "./SavingEstimatorConfigProvider";
import { CopyButton } from "../buttons/CopyButton";

export const Result = ({
  params,
  results,
  start,
  currency,
  onItemChange,
  onCurrencyChange,
  onPriceChange,
  onFrequencyChange,
  onStartDateChange,
}: {
  params: EstimatorParams;
  results?: ResultData;
  currency: OrderCurrency;
  start: string;
  onItemChange: (
    value: Pick<DcaEstimatorConfigFragment, "slug" | "type">
  ) => void;
  onCurrencyChange: (value: OrderCurrency) => void;
  onPriceChange: (value: string) => void;
  onFrequencyChange: (value: DcaInterval) => void;
  onStartDateChange: (value: string) => void;
}) => {
  const loading = useDebounce(results === undefined, 250, true);
  const { t, i18n } = useTranslation();
  const share = useTwitterShareLink(params, currency, results);
  return (
    <div>
      <h2 className="estimatorResult">
        <Trans
          i18nKey="estimator.results.phrase"
          t={t}
          parent={null}
          components={{
            currencyInput: (
              <CurrencyInput
                defaultValue={currency}
                onChange={onCurrencyChange}
              />
            ),
            itemPrice: (
              <PriceInput value={params.price} onChange={onPriceChange} />
            ),
            object: (
              <ItemSelectInput value={params.slug} onChange={onItemChange} />
            ),
            frequency: (
              <FrequencySelectInput
                value={params.frequency}
                onChange={onFrequencyChange}
              />
            ),
            startInput: (
              <DateInput value={start} onChange={onStartDateChange} />
            ),
            t: <React.Fragment />,
            loader: loading ? <LoadingCard /> : <React.Fragment />,
            percentPL: results ? (
              <FormatToPercent
                part={results.totalProfit}
                total={results.totalInvestment}
                withFraction={true}
              />
            ) : (
              <React.Fragment />
            ),
            small: <small />,
          }}
          values={{
            saved: formatAmount(
              results?.totalInvestment || 0,
              currency,
              i18n.language as "fr" | "en"
            ),
            bitcoinAmount: formatAmount(
              results?.totalBtcBought || 0,
              "btc",
              i18n.language as "fr" | "en"
            ),
            bitcoinValue: formatAmount(
              results?.totalBtcValue || 0,
              currency,
              i18n.language as "fr" | "en"
            ),
            profitOrLoss:
              (results?.totalProfit || 0) >= 0
                ? t("estimator.profit")
                : t("estimator.loss"),
            profitLoss: formatAmount(
              results?.totalProfit || 0,
              currency,
              i18n.language as "fr" | "en",
              true
            ),
            percentPL: formatToPercent({
              part: results?.totalProfit || 0,
              total: results?.totalInvestment || 0,
              withFraction: true,
            }),
          }}
        />
      </h2>
      <div className="socials">
        <div className={"mt-5"}>
          <CopyButton
            feedback={t("estimator.action.copyFeedback")}
            text={t("estimator.action.copyUrl")}
            value={share.documentUrl}
          />
        </div>
        <div>
          <a
            className={"btn btn-primary"}
            href={share.shareUrl}
            target={"_blank"}
            rel="noreferrer"
          >
            Share on twitter
          </a>
        </div>
      </div>
    </div>
  );
};

const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    throw new Error("Clipboard API not available");
  }
  await navigator.clipboard.writeText(text);
};

const toHumanDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const useTwitterShareLink = (
  params: EstimatorParams,
  currency: OrderCurrency,
  results?: ResultData
): { shareUrl: string; documentUrl: string; copy: () => Promise<void> } => {
  const { t, i18n } = useTranslation();

  const configs = useSavingEstimatorConfig();
  const type =
    configs.find((c) => c.slug === params.slug)?.type || ItemType.Other;

  const itemNameKey = `estimator.item.${type}` as const;
  const frequencyKey = `estimator.input.per.${params.frequency}` as const;

  const text = t("estimator.results.share", {
    currency: orderCurrencyToSymbol(currency),
    price: params.price,
    object: t(itemNameKey),
    frequency: t(frequencyKey),
    start: toHumanDate(params.since),
    saved: formatAmount(
      results?.totalInvestment || 0,
      currency,
      i18n.language as "fr" | "en",
      false,
      false
    ),
    bitcoinAmount: formatAmount(
      results?.totalBtcBought || 0,
      "btc",
      i18n.language as "fr" | "en"
    ),
    bitcoinValue: formatAmount(
      results?.totalBtcValue || 0,
      currency,
      i18n.language as "fr" | "en",
      false,
      false
    ),
    profitOrLoss:
      (results?.totalProfit || 0) >= 0
        ? t("estimator.profit")
        : t("estimator.loss"),
    profitLoss: formatAmount(
      results?.totalProfit || 0,
      currency,
      i18n.language as "fr" | "en",
      true,
      false
    ),
    percentPL: formatToPercent({
      part: results?.totalProfit || 0,
      total: results?.totalInvestment || 0,
      withFraction: false,
    }),
  });

  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.set("url", window.location.href);
  url.searchParams.set("text", text);

  return {
    documentUrl: window.location.href,
    shareUrl: url.toString(),
    copy: useCallback(() => copyToClipboard(window.location.href), []),
  };
};
