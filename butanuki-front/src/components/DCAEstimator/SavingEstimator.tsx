import {
  DcaEstimatorConfigFragment,
  DcaInterval,
  ItemType,
  OrderCurrency,
  useEstimationQuery,
} from "../../generated/graphql";
import React, { useCallback, useMemo, useState } from "react";
import { useSavingEstimatorConfig } from "./SavingEstimatorConfigProvider";
import { useDebounce } from "../../utils/hooks";
import { Result } from "./Result";
import { useSearchParams } from "react-router-dom";
import BigText from "../../locales/savings/BigText";

const isDcaInterval = (value?: string | null): value is DcaInterval => {
  return Object.values(DcaInterval).includes(value as DcaInterval);
};

const formatDateYYYYMMDD = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export interface ResultData {
  totalInvestment: number;
  totalBtcBought: number;
  totalBtcValue: number;
  totalProfit: number;
  averagePrice: number;
}

const yearsAgo = (count: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - count);
  return date;
};

type URLParams = {
  price?: string;
  slug?: string;
  frequency?: string;
  since?: string;
};

const useParams = (): [URLParams, (key: string, value?: string) => void] => {
  const [urlParams, setUrlParams] = useSearchParams();
  const frequencyParam = urlParams.get("frequency");
  const params = useMemo(() => {
    return {
      price: urlParams.get("price") ?? undefined,
      slug: urlParams.get("slug") ?? "",
      frequency: isDcaInterval(frequencyParam) ? frequencyParam : undefined,
      since: urlParams.get("since") ?? undefined,
    };
  }, [frequencyParam, urlParams]);
  const setParam = useCallback(
    (key: string, value?: string) => {
      setUrlParams((params) => {
        if (value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
        return params;
      });
    },
    [setUrlParams]
  );

  return [params, setParam];
};

const useEstimatorConfig = (): DcaEstimatorConfigFragment => {
  const [params] = useParams();
  const config = useSavingEstimatorConfig();
  if (!params.slug || params.slug !== "custom") {
    const saved = config.find((c) => c.slug === params.slug);
    if (saved) {
      return saved;
    }
    return config[0];
  } else {
    return {
      type: ItemType.Other,
      interval: isDcaInterval(params.frequency)
        ? params.frequency
        : DcaInterval.Weekly,
      price: parseInt(params.price ?? "0"),
      slug: "custom",
      emojis: "💩💩💩💩💩💩💩",
    };
  }
};

export type EstimatorParams = {
  emojis: string;
  price: string;
  slug: string;
  frequency: DcaInterval;
  since: string;
};

const useEstimatorParams = () => {
  const [urlParams, setUrlParam] = useParams();
  const config = useEstimatorConfig();
  return useMemo(() => {
    return {
      slug: config.slug,
      frequency: isDcaInterval(urlParams.frequency)
        ? urlParams.frequency
        : config.interval,
      since: urlParams.since ?? formatDateYYYYMMDD(yearsAgo(4)),
      emojis: config.emojis,
      price: urlParams.price ?? config.price.toString(),
    };
  }, [
    config.slug,
    config.interval,
    config.emojis,
    config.price,
    urlParams.frequency,
    urlParams.since,
    urlParams.price,
  ]);
};

export const validateDate = (
  date: string
): "invalid" | "out-of-bound" | "incomplete" | "valid" => {
  //after or equal to 2013-01-01 and before equal today
  if (date.length < 10) {
    return "incomplete";
  }

  if (Number.isNaN(Date.parse(date))) {
    return "invalid";
  }

  const dateObj = new Date(date);
  const today = new Date();
  const minDate = new Date("2013-01-01");
  if (dateObj < minDate || dateObj > today) {
    return "out-of-bound";
  }
  return "valid";
};

export default function SavingEstimator() {
  const [, setUrlParam] = useParams();
  const config = useEstimatorParams();

  const [currency, setCurrency] = useState<OrderCurrency>(OrderCurrency.Eur);
  const [end] = useState<string>(() => formatDateYYYYMMDD(new Date()));
  const dateStatus = validateDate(config.since);
  const result = useEstimationQuery({
    variables: {
      currency,
      start: useDebounce(config.since, 500),
      end: useDebounce(end, 500),
      interval: config.frequency,
    },
    skip: !config.since || !end || dateStatus !== "valid",
  });

  const amounts: ResultData | undefined = useMemo(() => {
    if (!result.data) {
      return undefined;
    }
    const totalInvestment =
      (Number.isNaN(Number(config.price)) ? 0 : Number(config.price)) *
      result.data.averageCostEstimator.transactionCount;

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
  }, [config.price, result.data]);

  const onChanges = useMemo(() => {
    return {
      onItemChange: ({
        slug,
      }: Pick<DcaEstimatorConfigFragment, "slug" | "type">) => {
        if (slug === "custom") {
          setUrlParam("slug", slug);
          console.log(slug);
          setUrlParam("price", config.price);
          setUrlParam("frequency", config.frequency);
          setUrlParam("since", config.since);
        } else {
          setUrlParam("slug", slug);
          setUrlParam("price", undefined);
        }
      },
      onFrequencyChange: (frequency: DcaInterval) => {
        setUrlParam("frequency", frequency);
      },
      onPriceChange: (price: string) => {
        setUrlParam("price", price);
        setUrlParam("slug", "custom");
      },
      onSinceChange: (since: string) => {
        setUrlParam("since", since);
      },
    };
  }, [config.frequency, config.price, config.since, setUrlParam]);

  return (
    <div className={"row"}>
      <div className="col-12 text-center">
        <h1 className={"mt-4"}>{config.emojis}💸</h1>
      </div>
      <div className="col-md-8 text-center mx-auto mt-4">
        <Result
          dateStatus={dateStatus}
          params={config}
          results={amounts}
          start={config.since}
          onItemChange={onChanges.onItemChange}
          onFrequencyChange={onChanges.onFrequencyChange}
          onPriceChange={onChanges.onPriceChange}
          onStartDateChange={onChanges.onSinceChange}
          onCurrencyChange={(currency) => {
            setCurrency(currency);
          }}
          currency={currency}
        />
      </div>
      <div className="col-md-8 mx-auto mt-5 lh-savings">
        <BigText />
      </div>
    </div>
  );
}
