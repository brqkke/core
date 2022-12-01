import { MainLayout } from "../../../layout/MainLayout";
import { SavingEstimatorConfigProvider } from "../../../components/DCAEstimator/SavingEstimatorConfigProvider";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../../../utils/hooks";
import { LoadingCard } from "../../../components/LoadingCard";
import React, { Suspense } from "react";

const SavingEstimator = React.lazy(
  () => import("../../../components/DCAEstimator/SavingEstimator")
);

export const EstimatorPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("estimator.title"));
  return (
    <MainLayout>
      <h1 className={"heading-bitcoin text-center"}>{t("estimator.title")}</h1>
      <SavingEstimatorConfigProvider>
        <Suspense fallback={<LoadingCard />}>
          <SavingEstimator />
        </Suspense>
      </SavingEstimatorConfigProvider>
    </MainLayout>
  );
};
