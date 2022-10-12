import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const onDelete = useCallback(() => {
    onDeleteVault(vault.id);
  }, [vault.id, onDeleteVault]);

  return (
    <div className={"mb-3 p-2"}>
      <div className="row">
        <div className="col-4">
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
        <div className="col-8">
          <div className="btn-toolbar justify-content-end"></div>
        </div>
      </div>
      <VaultOrders vault={vault} disabled={disabled} />
    </div>
  );
  // const { loading, response, error } = useCall<
  //   undefined,
  //   {
  //     order: {
  //       amount: number;
  //       currency: string;
  //       reference: string;
  //       bankDetails: {
  //         iban: string;
  //         swift_bic: string;
  //         recipient: string;
  //         account_number: string;
  //         bank_code: string;
  //         bank_address: string;
  //       };
  //       redactedCryptoAddress?: string;
  //     };
  //   }
  // >("GET", "/bity/order");
  //
  // if (loading) {
  //   return <p>{t("app.loading")}</p>;
  // }
  //
  // if (error && error.status === "404") {
  //   return (
  //     <p>
  //       {t("app.home.bity.not_setup")}
  //       <Link to={"/order-settings"} className={"btn btn-success"}>
  //         {t("app.home.setup_dca")}
  //       </Link>
  //     </p>
  //   );
  // }
  //
  // if (response) {
  //   return (
  //     <>
  //       <p>
  //         {t("app.order.amount")} : {response.order.amount}{" "}
  //         {response.order.currency}
  //         {!!response.order.redactedCryptoAddress && (
  //           <>
  //             <br />
  //             {t("app.order.crypto_address")} :{" "}
  //             {response.order.redactedCryptoAddress}
  //           </>
  //         )}
  //         <br />
  //         <Link
  //           to={"/order-settings"}
  //           className={`btn btn-primary btn-sm ${disabled ? "disabled" : ""}`}
  //         >
  //           {t("app.order.change_amount")}
  //         </Link>
  //         <br />
  //         {t("app.order.reference")} : <b>{response.order.reference}</b>
  //         <br />
  //       </p>
  //       <PaymentDetails {...response.order.bankDetails} />
  //     </>
  //   );
  // }

  return null;
}
