import {
  DcaInterval,
  OrderCurrency,
  useEstimationQuery,
} from "../../generated/graphql";
import { useMemo, useState } from "react";
import { LoadingCard } from "../LoadingCard";
import { formatAmount } from "../../utils/i18n";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../utils/hooks";

const currencies = [...Object.values(OrderCurrency)];
const CurrencySelector = ({
  onChange,
  defaultValue,
}: {
  onChange: (currency: OrderCurrency) => void;
  defaultValue: OrderCurrency;
}) => {
  return (
    <select
      className="form-select"
      onChange={(e) => onChange(e.target.value as OrderCurrency)}
      defaultValue={defaultValue}
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

const IntervalSelector = ({
  onChange,
  defaultValue,
}: {
  onChange: (interval: string) => void;
  defaultValue: DcaInterval;
}) => {
  const { t } = useTranslation();
  return (
    <select
      className="form-select"
      onChange={(e) => onChange(e.target.value)}
      defaultValue={defaultValue}
    >
      {Object.values(DcaInterval).map((interval: DcaInterval) => (
        <option key={interval} value={interval}>
          {t(`estimator.interval.${interval}` as const)}
        </option>
      ))}
    </select>
  );
};

const intervalToDays = (interval: DcaInterval) => {
  switch (interval) {
    case DcaInterval.Daily:
      return 1;
    case DcaInterval.Weekly:
      return 7;
    case DcaInterval.Monthly:
      return 30;
  }
};

const formatDateYYYYMMDD = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const oneYearAgo = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
};

const FormatToPercent = ({ part, total }: { part: number; total: number }) => {
  const ratio = part / total;
  const sign = ratio > 0 ? "+" : "";
  const className = ratio > 0 ? "text-success" : "text-danger";
  return (
    <span className={className}>
      {sign}
      {(ratio * 100).toFixed(2)}%
    </span>
  );
};

export const DCAEstimator = () => {
  const [currency, setCurrency] = useState<OrderCurrency>(OrderCurrency.Eur);
  const [duration, setDuration] = useState(1);
  const [interval, setInterval] = useState<DcaInterval>(DcaInterval.Weekly);
  const [start, setStart] = useState<string>(() =>
    formatDateYYYYMMDD(oneYearAgo())
  );
  const [end, setEnd] = useState<string>(() => formatDateYYYYMMDD(new Date()));

  const skip = useMemo(() => {
    const maxDate = new Date();
    const minDate = new Date("2013-01-01");
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate < minDate || endDate > maxDate || startDate > endDate;
  }, [start, end]);
  const [amount, setAmount] = useState(50);
  const { i18n, t } = useTranslation();

  // const [start, end] = useMemo(() => {
  //   const days = duration * 365;
  //   const end = new Date();
  //   const start = new Date();
  //   start.setDate(start.getDate() - days);
  //   return [
  //     Math.round(start.getTime() / 1000),
  //     Math.round(end.getTime() / 1000),
  //   ];
  // }, [duration]);
  const result = useEstimationQuery({
    variables: {
      currency,
      start: useDebounce(start, 500),
      end: useDebounce(end, 500),
      interval,
    },
    skip,
  });
  const amounts = useMemo(() => {
    if (!result.data) {
      return null;
    }
    const totalInvestment =
      amount * result.data.averageCostEstimator.transactionCount;

    const averagePrice = result.data.averageCostEstimator.averageBtcPrice || 0;

    const totalBtcBought = averagePrice ? totalInvestment / averagePrice : 0;
    const totalBtcValue = totalBtcBought * result.data.currentPrice;

    const totalProfit = totalBtcValue - totalInvestment;
    return {
      totalInvestment,
      totalBtcBought,
      totalBtcValue,
      totalProfit,
      averagePrice,
    };
  }, [amount, result.data]);
  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{t("estimator.title")}</h5>
          <div className="row">
            <div className="col-sm-3 mb-2">
              <div className="form-group">
                <label className="form-label">
                  {t("estimator.input.recurring_amount")}
                </label>
                <input
                  defaultValue={amount}
                  type="number"
                  className="form-control"
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="col-sm-3 mb-2">
              <div className="form-group">
                <label className="form-label" htmlFor="currency">
                  {t("estimator.input.currency")}
                </label>
                <CurrencySelector
                  onChange={setCurrency}
                  defaultValue={currency}
                />
              </div>
            </div>
            <div className="col-sm-3 mb-2">
              <div className="form-group">
                <label className="form-label" htmlFor="start">
                  {t("estimator.input.start_date")}
                </label>
                <input
                  value={start}
                  type="date"
                  className="form-control"
                  onChange={(e) => setStart(e.target.value)}
                  min={"2013-01-01"}
                  max={formatDateYYYYMMDD(new Date())}
                />
              </div>
              <div className="form-group mt-2">
                <label className="form-label" htmlFor="end">
                  {t("estimator.input.end_date")}
                </label>
                <input
                  value={end}
                  type="date"
                  className="form-control"
                  onChange={(e) => setEnd(e.target.value)}
                  min={"2013-01-01"}
                  max={formatDateYYYYMMDD(new Date())}
                />
              </div>
            </div>
            <div className="col-sm-3 mb-2">
              <div className="form-group">
                <label className="form-label" htmlFor="interval">
                  {t("estimator.input.interval")}
                </label>
                <IntervalSelector
                  onChange={(interval) => setInterval(interval as DcaInterval)}
                  defaultValue={interval}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {skip ? (
        <div className="alert alert-warning">
          {t("estimator.error.invalid_date")}
        </div>
      ) : null}
      {skip || result.loading || !result.data || !amounts ? (
        <LoadingCard />
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{t("estimator.results.title")}</h5>
            <div className="row">
              <div className="col-4">
                <p className={"lh-base"}>
                  {t("estimator.results.total_buys")}{" "}
                  {result.data.averageCostEstimator.transactionCount}
                  <br />
                  {t("estimator.results.total_spent")}{" "}
                  {formatAmount(
                    amounts.totalInvestment,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  {t("estimator.results.total_bought")}{" "}
                  {formatAmount(
                    amounts.totalBtcBought,
                    "btc",
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  {t("estimator.results.average_cost")}{" "}
                  {formatAmount(
                    amounts.averagePrice,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  {t("estimator.results.current_price")}{" "}
                  {formatAmount(
                    result.data.currentPrice,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  {t("estimator.results.valuation")}{" "}
                  {formatAmount(
                    amounts.totalBtcValue,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  {t("estimator.results.profit_loss")}{" "}
                  {formatAmount(
                    amounts.totalProfit,
                    currency,
                    i18n.language as "fr" | "en",
                    true
                  )}{" "}
                  <small>
                    <FormatToPercent
                      part={amounts.totalProfit}
                      total={amounts.totalInvestment}
                    />
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
