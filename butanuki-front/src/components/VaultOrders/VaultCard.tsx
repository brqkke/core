import { VaultInfosFragment } from "../../generated/graphql";
import { VaultHeaderCardBody } from "./VaultHeaderCardBody";
import { OrderCard } from "./OrderCard";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const VaultCard = ({
  vault,
  disabled,
}: {
  vault: VaultInfosFragment;
  disabled: boolean;
}) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <VaultHeaderCardBody vault={vault} />
      </div>

      <div className="card-body">
        <div className="row">
          {vault.orderTemplates.map((orderTemplate) => (
            <div key={orderTemplate.id} className={`col-lg-12 mb-4`}>
              <OrderCard order={orderTemplate} disabled={disabled} />
            </div>
          ))}
          <div className="col-lg-12">
            {vault.orderTemplates.length === 0 ? (
              <NoOrders vaultId={vault.id} disabled={disabled} />
            ) : (
              <AddOrder vaultId={vault.id} disabled={disabled} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoOrders = React.memo(
  ({ vaultId, disabled }: { disabled: boolean; vaultId: string }) => {
    const { t } = useTranslation();
    return (
      <p>
        {t("app.home.bity.not_setup")}{" "}
        <Link
          to={`/vault/${vaultId}/new-order`}
          className={`btn btn-success btn-sm ${disabled ? "disabled" : ""}`}
        >
          {t("app.home.setup_dca")}
        </Link>
      </p>
    );
  }
);

const AddOrder = React.memo(
  ({ disabled, vaultId }: { disabled: boolean; vaultId: string }) => {
    const { t } = useTranslation();
    return (
      <p>
        {t("app.order.create_order_text")}{" "}
        <Link
          to={`/vault/${vaultId}/new-order`}
          className={`btn btn-success btn-sm ${disabled ? "disabled" : ""}`}
        >
          {t("app.order.create_order")}
        </Link>
      </p>
    );
  }
);
