import { VaultInfosFragment } from "../generated/graphql";
import { useCallback } from "react";
import { VaultOrders } from "../pages/app/Home/Vaults/VaultOrders";
import { DeleteBtnWithConfirm } from "./buttons/DeleteBtnWithConfirm";

export function VaultStatus({
  disabled,
  vault,
  onDeleteVault,
}: {
  disabled: boolean;
  vault: VaultInfosFragment;
  onDeleteVault: (id: string) => unknown | Promise<unknown>;
}) {
  const onDelete = useCallback(() => {
    return onDeleteVault(vault.id);
  }, [vault.id, onDeleteVault]);

  return (
    <div className={"mb-3 p-2"}>
      <div className="row">
        <div className="col-3">
          <h3>
            {vault.name} -{" "}
            <small>
              {vault.currency} <DeleteBtnWithConfirm onDelete={onDelete} />
            </small>
          </h3>
        </div>
      </div>
      <VaultOrders vault={vault} disabled={disabled} />
    </div>
  );
}
