import { useCall } from "../api/hook";
import { Link } from "react-router-dom";
import { PaymentDetails } from "./PaymentDetails";
import { useTranslation } from "react-i18next";

export function OrderStatus({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation();
  const { loading, response, error } = useCall<
    undefined,
    {
      order: {
        amount: number;
        currency: string;
        reference: string;
        bankDetails: {
          iban: string;
          swift_bic: string;
          recipient: string;
          account_number: string;
          bank_code: string;
          bank_address: string;
        };
        redactedCryptoAddress?: string;
      };
    }
  >("GET", "/bity/order");

  if (loading) {
    return <p>{t("app.loading")}</p>;
  }

  if (error && error.status === "404") {
    return (
      <p>
        {t("app.home.bity.not_setup")}
        <Link to={"/order-settings"} className={"btn btn-success"}>
          {t("app.home.setup_dca")}
        </Link>
      </p>
    );
  }

  if (response) {
    return (
      <>
        <p>
          {t("app.order.amount")} : {response.order.amount}{" "}
          {response.order.currency}
          {!!response.order.redactedCryptoAddress && (
            <>
              <br />
              {t("app.order.crypto_address")} :{" "}
              {response.order.redactedCryptoAddress}
            </>
          )}
          <br />
          <Link
            to={"/order-settings"}
            className={`btn btn-primary btn-sm ${disabled ? "disabled" : ""}`}
          >
            {t("app.order.change_amount")}
          </Link>
          <br />
          {t("app.order.reference")} : <b>{response.order.reference}</b>
          <br />
        </p>
        <PaymentDetails {...response.order.bankDetails} />
      </>
    );
  }

  return null;
}
