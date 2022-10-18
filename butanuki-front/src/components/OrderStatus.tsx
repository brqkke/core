import { Link } from "react-router-dom";
import { PaymentDetails } from "./PaymentDetails";
import { useTranslation } from "react-i18next";
import {
  OrderInfosFragment,
  OrderTemplateInfosFragment,
} from "../generated/graphql";

export function OrderStatus({
  disabled,
  order,
  template,
  onDelete,
}: {
  disabled?: boolean;
  order: OrderInfosFragment;
  template: OrderTemplateInfosFragment;
  onDelete?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className="row p-2 m-2"
      style={{ border: "1px solid gray", borderRadius: "5px" }}
    >
      <div className="col-4">{!!template.name && <h4>{template.name}</h4>}</div>
      <div className="col-8">
        {!disabled && (
          <div className="btn-toolbar justify-content-end">
            <button className="btn btn-sm btn-danger" onClick={onDelete}>
              X
            </button>
          </div>
        )}
      </div>
      <div className="col-6">
        <p>
          {t("app.order.amount")} : {order.amount} {order.currency}
          {!!order.redactedCryptoAddress && (
            <>
              <br />
              {t("app.order.crypto_address")} : {order.redactedCryptoAddress}
            </>
          )}
          <br />
          {!disabled && (
            <>
              <Link
                to={`/vault/${template.vaultId}/edit-order/${order.orderTemplateId}`}
                className={`btn btn-primary btn-sm ${
                  disabled ? "disabled" : ""
                }`}
              >
                {t("app.order.change_amount")}
              </Link>
              <br />
            </>
          )}
          {t("app.order.reference")} : <b>{order.transferLabel}</b>
          <br />
        </p>
      </div>
      <div className="col-6">
        <PaymentDetails {...order.bankDetails} />
      </div>
    </div>
  );
}
