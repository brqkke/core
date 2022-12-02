import { useState } from "react";

export const DateInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [valid, setValid] = useState(true);
  return (
    <input
      className={`form-control ${valid ? "" : "is-invalid"}`}
      type="date"
      min="2013-01-01"
      max={new Date().toISOString().split("T")[0]}
      onChange={(e) => {
        onChange(e.target.value);
        setValid(e.target.validity.valid);
      }}
      value={value}
    />
  );
};
