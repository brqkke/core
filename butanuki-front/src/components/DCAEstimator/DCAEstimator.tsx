import {
  DcaInterval,
  OrderCurrency,
  useEstimationQuery,
} from "../../generated/graphql";
import { useMemo, useState } from "react";
import { LoadingCard } from "../LoadingCard";
import { formatAmount } from "../../utils/i18n";
import { useTranslation } from "react-i18next";

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
  return (
    <select
      className="form-select"
      onChange={(e) => onChange(e.target.value)}
      defaultValue={defaultValue}
    >
      {Object.values(DcaInterval).map((interval) => (
        <option key={interval} value={interval}>
          {interval}
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

export const DCAEstimator = () => {
  const [currency, setCurrency] = useState<OrderCurrency>(OrderCurrency.Eur);
  const [duration, setDuration] = useState(1);
  const [interval, setInterval] = useState<DcaInterval>(DcaInterval.Weekly);
  const [amount, setAmount] = useState(50);
  const { i18n } = useTranslation();

  const [start, end] = useMemo(() => {
    const days = duration * 365;
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return [
      Math.round(start.getTime() / 1000),
      Math.round(end.getTime() / 1000),
    ];
  }, [duration]);
  const result = useEstimationQuery({
    variables: {
      currency,
      startTimestamp: start,
      endTimestamp: end,
      interval,
    },
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
          <h5 className="card-title">DCA Estimator</h5>
          <div className="row">
            <div className="col-3">
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  defaultValue={amount}
                  type="number"
                  className="form-control"
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label className="form-label" htmlFor="currency">
                  Currency
                </label>
                <CurrencySelector
                  onChange={setCurrency}
                  defaultValue={currency}
                />
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label className="form-label" htmlFor="duration">
                  Nombre d'années
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label className="form-label" htmlFor="interval">
                  Interval d'achat
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
      {result.loading || !result.data || !amounts ? (
        <LoadingCard />
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Results</h5>
            <div className="row">
              <div className="col-4">
                <p>
                  Nombre d'achats:{" "}
                  {result.data.averageCostEstimator.transactionCount}
                  <br />
                  Total épargné:{" "}
                  {formatAmount(
                    amounts.totalInvestment,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  Bitcoin achetés :{" "}
                  {formatAmount(
                    amounts.totalBtcBought,
                    "btc",
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  Prix d'achat moyen :{" "}
                  {formatAmount(
                    amounts.averagePrice,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  Prix actuel :{" "}
                  {formatAmount(
                    result.data.currentPrice,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  Valeur actuelle :{" "}
                  {formatAmount(
                    amounts.totalBtcValue,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                  <br />
                  Bénéfice/Perte :{" "}
                  {formatAmount(
                    amounts.totalProfit,
                    currency,
                    i18n.language as "fr" | "en"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
