import {
  useDeleteVaultMutation,
  VaultInfosFragment,
} from "../../generated/graphql";
import { useCallback } from "react";
import { VaultOrders } from "../../pages/app/Home/Vaults/VaultOrders";
import { DeleteBtnWithConfirm } from "../buttons/DeleteBtnWithConfirm";

export function VaultStatus({
  disabled,
  vault,
}: {
  disabled: boolean;
  vault: VaultInfosFragment;
}) {
  const [deleteVault, deleteVaultResult] = useDeleteVaultMutation({
    update: (cache, { data }) => {
      if (data?.deleteVault) {
        cache.evict({ id: cache.identify(data.deleteVault) });
      }
    },
  });

  const onDeleteVault = useCallback(
    () => deleteVault({ variables: { vaultId: vault.id } }),
    [deleteVault, vault.id]
  );
  return (
    <div className={"mb-3 p-2"}>
      <div className="row">
        <div className="col-3">
          <h3>
            {vault.name} -{" "}
            <small>
              {vault.currency}{" "}
              <DeleteBtnWithConfirm
                onDelete={onDeleteVault}
                mutationResult={deleteVaultResult}
              />
            </small>
          </h3>
        </div>
      </div>
      <VaultOrders vault={vault} disabled={disabled} />
    </div>
  );
}
