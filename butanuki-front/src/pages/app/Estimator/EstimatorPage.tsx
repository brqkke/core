import { MainLayout } from "../../../layout/MainLayout";
import { SavingEstimator } from "../../../components/DCAEstimator/SavingEstimator";
import { SavingEstimatorConfigProvider } from "../../../components/DCAEstimator/SavingEstimatorConfigProvider";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../../../utils/hooks";

export const EstimatorPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("estimator.title"));
  return (
    <MainLayout>
      <h1 className={"heading-bitcoin text-center"}>{t("estimator.title")}</h1>
      <SavingEstimatorConfigProvider>
        <SavingEstimator />
      </SavingEstimatorConfigProvider>
    </MainLayout>
  );
};
