import React from "react";
import {
  useDeleteVaultMutation,
  VaultShortInfosFragment,
} from "../../generated/graphql";
import { useTranslation } from "react-i18next";
import { DeleteBtnWithConfirm } from "../buttons/DeleteBtnWithConfirm";
import { Link } from "react-router-dom";

export const VaultHeaderCardBody = React.memo(
  ({ vault }: { vault: VaultShortInfosFragment }) => {
    const [deleteVault, deleteVaultResult] = useDeleteVaultMutation({
      update: (cache, { data }) => {
        if (data?.deleteVault) {
          cache.evict({ id: cache.identify(data.deleteVault) });
        }
      },
      variables: { vaultId: vault.id },
    });
    const { t } = useTranslation();
    return (
      <div className="row">
        <div className="col-md-4">
          <h4 className="mt-1">{vault.name}</h4>
          <p className="text-muted mb-0">
            {t("app.vault.currency")} : {vault.currency}
          </p>
        </div>
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="d-flex justify-content-end mt-2">
            <Link
              className="btn btn-outline-primary"
              to={`/vault/${vault.id}/edit`}
            >
              {t("app.action.edit")}
            </Link>
            <DeleteBtnWithConfirm
              onDelete={deleteVault}
              mutationResult={deleteVaultResult}
              label={t("app.action.delete")}
              className={"ms-2"}
            />
          </div>
        </div>
      </div>
    );
  }
);
