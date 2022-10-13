import { MainLayout } from "../../layout/MainLayout";
import { useState } from "react";
import { ApiError } from "../../api/call";
import { useHistory, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { LoggedLayout } from "../../layout/LoggedLayout";
import { ApiErrorAlert } from "../../components/ApiErrorAlert";
import {
  useAddOrderMutation,
  useOrderQuery,
  useVaultQuery,
} from "../../generated/graphql";

type Order = {
  amount: number;
  currency: "CHF" | "EUR";
  reference: string;
};

export function OrderSettings() {
  // const { loading, response } = useCall<
  //   undefined,
  //   {
  //     order: Order;
  //   }
  // >("GET", "/bity/order");
  const { vaultId, orderId } = useParams<{
    vaultId: string;
    orderId?: string;
  }>();

  const vault = useVaultQuery({ variables: { id: vaultId } });
  const order = useOrderQuery({
    variables: {
      id: orderId || "",
    },
    skip: !orderId,
  });
  const [placeOrder] = useAddOrderMutation();

  const { t } = useTranslation();
  const [amount, setAmount] = useState(10);
  //const [currency, setCurrency] = useState<"CHF" | "EUR">("CHF");

  const [cryptoAddress, setCryptoAddress] = useState("");
  const [error, setError] = useState<ApiError | undefined>();

  const history = useHistory();
  // useEffect(() => {
  //   if (response) {
  //     setAmount(response.order.amount);
  //   }
  // }, [response]);

  const submit = async () => {
    if (amount && cryptoAddress) {
      setError(undefined);
      // const response = await put<
      //   { currency: string; amount: number; cryptoAddress: string },
      //   undefined
      // >("/bity/order", { currency, amount, cryptoAddress });
      // if (response.error) {
      //   setError(response.error);
      // } else {
      //   history.replace("/");
      // }
      placeOrder({
        variables: {
          vaultId,
          data: { amount, cryptoAddress },
          replaceOrderId: orderId,
        },
      });
    }
  };

  if (vault.loading || !vault.data || order.loading) {
    return (
      <MainLayout>
        <div className="row">
          <div className="col-md-6">
            <p>{t("app.loading")}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <LoggedLayout>
      <div className="row">
        <div className="col-12">
          <pre>{JSON.stringify(vault.data)}</pre>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <br />
          {error && <ApiErrorAlert error={error} />}
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
              return false;
            }}
          >
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {t("app.order.amount")}
                  </span>
                </div>
                <input
                  className={"form-control"}
                  onChange={(ev) => {
                    setAmount(parseInt(ev.target.value));
                  }}
                  id={"inputAmount"}
                  value={amount}
                  type={"number"}
                  min={0}
                  placeholder={"Order amount"}
                />
                <div className="input-group-append">
                  <select
                    className="form-control custom-select"
                    id="currencySelect"
                    value={vault.data.vault.currency}
                    disabled={true}
                  >
                    <option value={"CHF"}>CHF</option>
                    <option value={"EUR"}>EUR</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {t("app.order.crypto_address")}
                  </span>
                </div>
                <input
                  className={"form-control"}
                  onChange={(ev) => {
                    setCryptoAddress(ev.target.value);
                  }}
                  value={cryptoAddress}
                  placeholder={t("app.order.crypto_address_desc")}
                />
              </div>
            </div>
            <br />
            {/*{response?.order && (*/}
            {/*  <>*/}
            {/*    <div className={"alert alert-warning"}>*/}
            {/*      {t("app.order.warning_reset")}*/}
            {/*    </div>*/}
            {/*    <br />*/}
            {/*  </>*/}
            {/*)}*/}
            <button
              type={"button"}
              className={"btn btn-secondary"}
              onClick={() => {
                history.goBack();
              }}
            >
              {t("app.order.go_back")}
            </button>
            <button
              type={"submit"}
              disabled={!amount || !cryptoAddress}
              className={"btn btn-primary"}
            >
              {t("app.order.save")}
            </button>
          </form>
        </div>
      </div>
    </LoggedLayout>
  );
}
