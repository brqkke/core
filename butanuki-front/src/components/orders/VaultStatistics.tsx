import { OrderCurrency, Vault } from "../../generated/graphql";
import { useTranslation } from "react-i18next";
import { formatAmount } from "../../utils/i18n";

export const VaultStatistics = (props: {
  vaultStatistics: Vault["statistics"];
  currency: OrderCurrency;
}) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <p>
        {t("app.vault.statistics.total_spent")} :{" "}
        {formatAmount(
          props.vaultStatistics.totalSpent,
          props.currency,
          i18n.language as "en" | "fr"
        )}
      </p>
      <p>
        {t("app.vault.statistics.total_received")} :{" "}
        {formatAmount(
          props.vaultStatistics.totalReceived,
          "btc",
          i18n.language as "en" | "fr"
        )}
      </p>
    </>
  );
};
