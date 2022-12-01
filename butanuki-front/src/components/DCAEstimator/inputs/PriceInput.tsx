export const PriceInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <input
      className="form-control priceInput pe-1"
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
