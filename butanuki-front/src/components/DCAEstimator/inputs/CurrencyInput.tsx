import { OrderCurrency } from "../../../generated/graphql";

export const orderCurrencyToSymbol = (currency: OrderCurrency) => {
  switch (currency) {
    case OrderCurrency.Chf:
      return "CHF";
    case OrderCurrency.Eur:
      return "€";
    default:
      return currency;
  }
};

export const CurrencyInput = ({
  defaultValue,
  onChange,
}: {
  defaultValue: OrderCurrency;
  onChange: (value: OrderCurrency) => void;
}) => {
  return (
    <select
      className="form-select currencySelector ps-0 pe-2"
      onChange={(e) => onChange(e.target.value as OrderCurrency)}
      defaultValue={defaultValue}
    >
      {Object.values(OrderCurrency).map((currency) => (
        <option key={currency} value={currency}>
          {orderCurrencyToSymbol(currency)}
        </option>
      ))}
    </select>
  );
};
