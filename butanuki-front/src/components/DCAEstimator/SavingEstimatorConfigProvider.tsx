import { createContext, useContext } from "react";
import {
  DcaEstimatorConfigFragment,
  useSavingEstimatorQuery,
} from "../../generated/graphql";

const ctx = createContext<DcaEstimatorConfigFragment[]>([]);

export const useSavingEstimatorConfig = () => {
  return useContext(ctx);
};

export const SavingEstimatorConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const config = useSavingEstimatorQuery();
  if (config.loading) {
    return null;
  }
  if (!config.data) {
    return null;
  }
  return (
    <ctx.Provider value={config.data.dcaEstimatorConfigs}>
      {children}
    </ctx.Provider>
  );
};
