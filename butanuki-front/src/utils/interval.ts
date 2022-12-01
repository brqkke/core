import { DcaInterval } from "../generated/graphql";

export const intervalToDays = (interval: DcaInterval) => {
  switch (interval) {
    case DcaInterval.Daily:
      return 1;
    case DcaInterval.Weekly:
      return 7;
    case DcaInterval.Monthly:
      return 30;
    default:
      return 1;
  }
};

export const sortedIntervals = () =>
  Object.values(DcaInterval).sort(
    (a, b) => intervalToDays(a) - intervalToDays(b)
  );
