import { VaultInfosFragment } from "../generated/graphql";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "./OrderStatus";

interface Props {
  vault: VaultInfosFragment;
  disabled: boolean;
}

export function VaultOrders({ vault, disabled }: Props) {
  return (
    <div className="row">
      {vault.orders.map((order) => (
        <div className="col-12" key={order.id}>
          <OrderStatus order={order} disabled={disabled} />
        </div>
      ))}
      {vault.orders.length === 0 ? (
        <NoOrders vaultId={vault.id} />
      ) : (
        <AddOrder vaultId={vault.id} />
      )}
    </div>
  );
}

function NoOrders({ vaultId }: { vaultId: string }) {
  const { t } = useTranslation();
  return (
    <p>
      {t("app.home.bity.not_setup")}
      <Link to={`/vault/${vaultId}/new-order`} className={"btn btn-success"}>
        {t("app.home.setup_dca")}
      </Link>
    </p>
  );
}

function AddOrder({ vaultId }: { vaultId: string }) {
  const { t } = useTranslation();
  return (
    <p>
      Besoin d'acheter du bitcoin supplémentaire ?{" "}
      <Link
        to={`/vault/${vaultId}/new-order`}
        className={"btn btn-success btn-sm"}
      >
        Add a New Order
      </Link>
    </p>
  );
}
