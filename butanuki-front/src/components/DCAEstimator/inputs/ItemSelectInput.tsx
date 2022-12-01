import {
  DcaEstimatorConfigFragment,
  ItemType,
} from "../../../generated/graphql";
import { useSavingEstimatorConfig } from "../SavingEstimatorConfigProvider";
import { useTranslation } from "react-i18next";

export const ItemSelectInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: Pick<DcaEstimatorConfigFragment, "slug" | "type">) => void;
}) => {
  const configs = useSavingEstimatorConfig();
  const { t } = useTranslation();
  return (
    <select
      className="form-select itemSelector ps-0 pe-2"
      onChange={(e) => {
        const config = configs.find((c) => c.slug === e.target.value) || {
          slug: "custom",
          type: ItemType.Other,
        };

        onChange(config);
      }}
      value={value}
    >
      {configs.map((config) => {
        const nameKey = `estimator.item.${config.type}` as const;
        return (
          <option key={config.slug} value={config.slug}>
            {t(nameKey)}
          </option>
        );
      })}
      <option key={"custom"} value={"custom"}>
        {t("estimator.item.OTHER")}
      </option>
    </select>
  );
};
