import { useUserContext } from "../context/UserContext";
import { VaultStatus } from "./VaultStatus";
import { useCallback, useState } from "react";
import { VaultForm } from "./VaultForm";
import {
  useAddVaultMutation,
  useDeleteVaultMutation,
  VaultInfosFragmentDoc,
  VaultInput,
} from "../generated/graphql";
import { useTranslation } from "react-i18next";

export const Vaults = ({ disabled }: { disabled: boolean }) => {
  const user = useUserContext();
  const [newVaultForm, setNewVaultForm] = useState(false);
  const { t } = useTranslation();
  const [addVault] = useAddVaultMutation({
    // refetchQueries: [{ query: MeDocument }],
    update: (cache, { data }) => {
      if (!data?.addVault) {
        return;
      }
      cache.modify({
        id: cache.identify(user),
        fields: {
          vaults: (existingVaults = []) => {
            const newVaultRef = cache.writeFragment({
              data: data?.addVault,
              fragment: VaultInfosFragmentDoc,
              fragmentName: "VaultInfos",
            });
            return [...existingVaults, newVaultRef];
          },
        },
      });
    },
  });
  const [deleteVault] = useDeleteVaultMutation({
    update: (cache, { data }) => {
      if (data?.deleteVault) {
        cache.evict({ id: cache.identify(data.deleteVault) });
      }
    },
  });
  const submitNew = useCallback(
    async (input: VaultInput) => {
      await addVault({ variables: { data: input } });
      setNewVaultForm(false);
    },
    [addVault]
  );
  const onDeleteVault = useCallback(
    (id: string) => {
      deleteVault({ variables: { vaultId: id } });
    },
    [deleteVault]
  );

  const closeForm = useCallback(() => setNewVaultForm(false), []);

  return (
    <div className="row">
      <hr />
      {user.vaults.map((vault) => (
        <div className="col-12" key={vault.id}>
          <VaultStatus
            disabled={disabled}
            vault={vault}
            onDeleteVault={onDeleteVault}
          />
          <hr />
        </div>
      ))}
      <div className="col-6">
        {newVaultForm ? (
          <VaultForm onSave={submitNew} key={"new"} cancel={closeForm} />
        ) : (
          user.vaults.length < 3 && (
            <button
              className={"btn btn-primary"}
              disabled={disabled}
              onClick={() => setNewVaultForm(true)}
            >
              {t("app.vault.add")}
            </button>
          )
        )}
      </div>
    </div>
  );
};
