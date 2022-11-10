import { VaultFormCard } from "./VaultForm";
import { useVaultsQuery } from "../../../../generated/graphql";
import React from "react";
import { VaultCard } from "../../../../components/VaultOrders/VaultCard";
import { LoadingCard } from "../../../../components/LoadingCard";
import { useDebounce } from "../../../../utils/hooks";
import { useConfigContext } from "../../../../context/ConfigContext";

export const Vaults = React.memo(({ disabled }: { disabled: boolean }) => {
  const vaults = useVaultsQuery();
  const config = useConfigContext();
  const vaultLoading = useDebounce(vaults.loading, 100, true);
  return (
    <div className="row">
      {vaultLoading || !vaults.data ? (
        <div className="col-lg-12">
          <LoadingCard />
        </div>
      ) : (
        <>
          {vaults.data?.me.vaults.map((vault) => (
            <div key={vault.id} className="col-lg-12">
              <VaultCard
                vault={vault}
                disabled={disabled}
                maxOrdersTemplatesPerVault={config.maxOrdersTemplatesPerVault}
              />
            </div>
          ))}
          <div className="col-lg-12">
            {vaults?.data && (
              <VaultFormCard
                disabled={disabled}
                totalCurrentVaults={vaults.data.me.vaults.length}
                maxVaults={config.maxVaultsPerUser}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
});
