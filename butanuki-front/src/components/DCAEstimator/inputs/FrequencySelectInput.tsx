import { DcaInterval } from "../../../generated/graphql";
import { useTranslateFrequency } from "../../../utils/i18n";
import { sortedIntervals } from "../../../utils/interval";
import { useMemo } from "react";

export const FrequencySelectInput = ({
  value,
  onChange,
}: {
  value: DcaInterval;
  onChange: (value: DcaInterval) => void;
}) => {
  const t = useTranslateFrequency();
  const intervals = useMemo(sortedIntervals, []);
  return (
    <select
      className="form-select"
      onChange={(e) => onChange(e.target.value as DcaInterval)}
      value={value}
    >
      {intervals.map((interval) => (
        <option key={interval} value={interval}>
          {t(interval)}
        </option>
      ))}
    </select>
  );
};
