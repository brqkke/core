import { CurrencyInput } from "./inputs/CurrencyInput";
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
import { formatAmount, usePublicPageLink } from "../../utils/i18n";
import { Trans, useTranslation } from "react-i18next";
import { EstimatorParams, ResultData } from "./SavingEstimator";
import {
  FormatToPercent,
  formatToPercent,
  nanToZero,
} from "../PercentageUtils";
import { LoadingCard } from "../LoadingCard";
import { useDebounce } from "../../utils/hooks";
import { useSavingEstimatorConfig } from "./SavingEstimatorConfigProvider";
import { CopyButton } from "../buttons/CopyButton";
import { Alert } from "../alerts/Alert";
import { ShareButton } from "../buttons/Social";
import { Col, Row } from "react-bootstrap";

const Loader = ({
  dateStatus,
}: {
  dateStatus: "valid" | "invalid" | "out-of-bound" | "incomplete";
}) => {
  switch (dateStatus) {
    case "valid":
      return <LoadingCard />;
    default:
      return null;
  }
};

const ValidationError = ({
  dateStatus,
}: {
  dateStatus: "valid" | "invalid" | "out-of-bound" | "incomplete";
}) => {
  const { t } = useTranslation();
  switch (dateStatus) {
    case "invalid":
      return <Alert message={"invalid"} level={"danger"} />;
    case "out-of-bound":
      return (
        <Alert message={t("estimator.error.invalid_date")} level={"warning"} />
      );
    case "incomplete":
      return null;
    default:
      return null;
  }
};

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
  dateStatus,
}: {
  dateStatus: "valid" | "invalid" | "out-of-bound" | "incomplete";
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
  const link = usePublicPageLink();
  const loading = useDebounce(results === undefined, 250, true);
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h2 className="estimatorResult text-center">
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
            loader: loading ? (
              <Loader dateStatus={dateStatus} />
            ) : (
              <React.Fragment />
            ),
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
            p: <span />,
            br: <br />,
            nb: <span className="no-break" />,
          }}
          values={{
            saved: formatAmount(
              results?.totalInvestment || 0,
              currency,
              i18n.language
            ),
            bitcoinAmount: formatAmount(
              results?.totalBtcBought || 0,
              "btc",
              i18n.language
            ),
            bitcoinValue: formatAmount(
              results?.totalBtcValue || 0,
              currency,
              i18n.language
            ),
            profitOrLoss:
              (results?.totalProfit || 0) >= 0
                ? t("estimator.profit")
                : t("estimator.loss"),
            profitLoss: formatAmount(
              Math.abs(results?.totalProfit || 0),
              currency,
              i18n.language,
              false
            ),
            percentPL: formatToPercent({
              part: results?.totalProfit || 0,
              total: results?.totalInvestment || 0,
              withFraction: true,
            }),
          }}
        />
      </h2>
      <ValidationError dateStatus={dateStatus} />
      <div className="row text-center">
        <div className="col-md-12">
          <a className={"estimator-share-button"} href={link("root")}>
            {t("estimator.action.startNow")}
          </a>
        </div>
        {dateStatus === "valid" && (
          <Share params={params} currency={currency} results={results} />
        )}
      </div>
    </div>
  );
};

const Share = ({
  params,
  currency,
  results,
}: {
  params: EstimatorParams;
  currency: OrderCurrency;
  results?: ResultData;
}) => {
  const { t } = useTranslation();
  const share = useShareLink(params, currency, results);
  return (
    <div className="col-md-12 mt-4">
      <div className="socials card">
        <div className={"card-body text-center"}>
          <div className="card-title">
            <h3>{t("estimator.share")}</h3>
          </div>
          <Row>
            <Col sm={"6"} className={"mx-auto"}>
              <CopyButton
                feedback={t("estimator.action.copyFeedback")}
                text={t("estimator.action.copyUrl")}
                value={share.url}
              />
            </Col>
          </Row>
          <ShareButton
            url={share.url}
            buttonText={t("estimator.action.shareOnTwitter")}
            text={share.text}
            platform={"twitter"}
          />
          <ShareButton
            url={share.url}
            buttonText={t("estimator.action.shareOnFacebook")}
            text={share.text}
            platform={"facebook"}
          />
          <ShareButton
            url={share.url}
            buttonText={t("estimator.action.shareOnLinkedIn")}
            text={share.text}
            platform={"linkedin"}
          />
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

const useShareLink = (
  params: EstimatorParams,
  currency: OrderCurrency,
  results?: ResultData
) => {
  const { t, i18n } = useTranslation();

  const configs = useSavingEstimatorConfig();
  const type =
    configs.find((c) => c.slug === params.slug)?.type || ItemType.Other;

  const itemNameKey = `estimator.item.${type}` as const;
  const frequencyKey = `estimator.input.per.${params.frequency}` as const;

  const text = t("estimator.results.share", {
    price: formatAmount(
      nanToZero(Number(params.price || 0)),
      currency,
      i18n.language,
      false,
      false
    ),
    object: t(itemNameKey),
    frequency: t(frequencyKey),
    start: toHumanDate(params.since),
    saved: formatAmount(
      results?.totalInvestment || 0,
      currency,
      i18n.language,
      false,
      false
    ),
    bitcoinAmount: formatAmount(
      results?.totalBtcBought || 0,
      "btc",
      i18n.language
    ),
    bitcoinValue: formatAmount(
      results?.totalBtcValue || 0,
      currency,
      i18n.language,
      false,
      false
    ),
    profitOrLoss:
      (results?.totalProfit || 0) >= 0
        ? t("estimator.profit")
        : t("estimator.loss"),
    profitLoss: formatAmount(
      Math.abs(results?.totalProfit || 0),
      currency,
      i18n.language,
      false,
      false
    ),
    percentPL: formatToPercent({
      part: results?.totalProfit || 0,
      total: results?.totalInvestment || 0,
      withFraction: false,
    }),
  });
  return {
    text,
    url: window.location.href,
    copyToClipboard: useCallback(
      () => copyToClipboard(window.location.href),
      []
    ),
  };
};
