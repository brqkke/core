import React from "react";

export const nanToZero = (value: number) => (Number.isNaN(value) ? 0 : value);

export const formatToPercent = ({
  part,
  total,
  withFraction,
}: {
  part: number;
  total: number;
  withFraction: boolean;
}) => {
  const ratio = nanToZero(part / total);
  const sign = ratio >= 0 ? "+" : "";
  return `${sign} ${(ratio * 100).toFixed(withFraction ? 2 : 0)}%`;
};

export const FormatToPercent = ({
  part,
  total,
  withFraction,
}: {
  part: number;
  total: number;
  withFraction: boolean;
}) => {
  const className = part >= total ? "text-success" : "text-danger";
  return (
    <span className={className}>
      {formatToPercent({ part, total, withFraction })}
    </span>
  );
};
