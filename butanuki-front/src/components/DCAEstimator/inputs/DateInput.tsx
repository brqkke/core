export const DateInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <input
      className="form-control"
      type="date"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  );
};
