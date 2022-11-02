import { VaultInfosFragment } from "../../../../generated/graphql";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "../../../../components/orders/OrderStatus";
import React from "react";

interface Props {
  vault: VaultInfosFragment;
  disabled: boolean;
}

export const VaultOrders = React.memo(({ vault, disabled }: Props) => {
  return (
    <div className="row">
      {vault.orderTemplates.map(
        (orderTemplate) =>
          orderTemplate.activeOrder && (
            <div className="col-12" key={orderTemplate.id}>
              <OrderStatus
                order={orderTemplate.activeOrder}
                disabled={disabled}
                template={orderTemplate}
              />
            </div>
          )
      )}
      {vault.orderTemplates.length === 0 ? (
        <NoOrders vaultId={vault.id} />
      ) : (
        <AddOrder vaultId={vault.id} />
      )}
    </div>
  );
});

const NoOrders = React.memo(({ vaultId }: { vaultId: string }) => {
  const { t } = useTranslation();
  return (
    <p>
      {t("app.home.bity.not_setup")}
      <Link to={`/vault/${vaultId}/new-order`} className={"btn btn-success"}>
        {t("app.home.setup_dca")}
      </Link>
    </p>
  );
});

const AddOrder = React.memo(({ vaultId }: { vaultId: string }) => {
  const { t } = useTranslation();
  return (
    <p>
      {t("app.order.create_order_text")}{" "}
      <Link
        to={`/vault/${vaultId}/new-order`}
        className={"btn btn-success btn-sm"}
      >
        {t("app.order.create_order")}
      </Link>
    </p>
  );
});
