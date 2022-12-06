import React from "react";
import {
  useDeleteVaultMutation,
  VaultInfosFragment,
} from "../../generated/graphql";
import { useTranslation } from "react-i18next";
import { DeleteBtnWithConfirm } from "../buttons/DeleteBtnWithConfirm";
import { Link } from "react-router-dom";
import { VaultStatistics } from "../orders/VaultStatistics";

export const VaultHeaderCardBody = React.memo(
  ({ vault }: { vault: VaultInfosFragment }) => {
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
        <div className="col-6 col-md-4">
          <h2>{vault.name}</h2>
          <p className="text-muted mb-0">
            {t("app.vault.currency")} : {vault.currency}
          </p>
        </div>
        <div className="col-6 col-md-4">
          <VaultStatistics
            vaultStatistics={vault.statistics}
            currency={vault.currency}
            bitcoinPrice={vault.bitcoinPrice}
          />
        </div>
        <div className="col-12 col-md-4">
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
