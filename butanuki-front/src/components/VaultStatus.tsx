import { VaultInfosFragment } from "../generated/graphql";
import { useCallback } from "react";
import { VaultOrders } from "./VaultOrders";

export function VaultStatus({
  disabled,
  vault,
  onDeleteVault,
}: {
  disabled: boolean;
  vault: VaultInfosFragment;
  onDeleteVault: (id: string) => void;
}) {
  const onDelete = useCallback(() => {
    onDeleteVault(vault.id);
  }, [vault.id, onDeleteVault]);

  return (
    <div className={"mb-3 p-2"}>
      <div className="row">
        <div className="col-3">
          <h3>
            {vault.name} -{" "}
            <small>
              {vault.currency}{" "}
              <button className="btn btn-sm btn-danger" onClick={onDelete}>
                X
              </button>
            </small>
          </h3>
        </div>
      </div>
      <VaultOrders vault={vault} disabled={disabled} />
    </div>
  );
}
