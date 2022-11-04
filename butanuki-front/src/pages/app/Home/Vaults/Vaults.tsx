import { VaultFormCard } from "./VaultForm";
import { useVaultsQuery } from "../../../../generated/graphql";
import React from "react";
import { VaultCard } from "../../../../components/VaultOrders/VaultCard";
import { LoadingCard } from "../../../../components/LoadingCard";

export const Vaults = React.memo(({ disabled }: { disabled: boolean }) => {
  const vaults = useVaultsQuery();

  return (
    <div className="row">
      {vaults.loading && (
        <div className="col-lg-12">
          <LoadingCard />
        </div>
      )}
      {vaults.data?.me.vaults.map((vault) => (
        <div key={vault.id} className="col-lg-12">
          <VaultCard vault={vault} disabled={disabled} />
        </div>
      ))}
      <div className="col-lg-12">
        {vaults?.data && (
          <VaultFormCard
            disabled={disabled}
            totalCurrentVaults={vaults.data.me.vaults.length}
            maxVaults={3}
          />
        )}
      </div>
    </div>
  );
});
