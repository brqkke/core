import { MainLayout } from "../../layout/MainLayout";
import { useCall } from "../../api/hook";
import { useEffect, useState } from "react";
import { ApiError, put } from "../../api/call";
import { useHistory, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { LoggedLayout } from "../../layout/LoggedLayout";
import { ApiErrorAlert } from "../../components/ApiErrorAlert";
import { useVaultQuery } from "../../generated/graphql";

type Order = {
  amount: number;
  currency: "CHF" | "EUR";
  reference: string;
};

export function OrderSettings() {
  const { loading, response } = useCall<
    undefined,
    {
      order: Order;
    }
  >("GET", "/bity/order");
  const { vaultId } = useParams<{ vaultId: string }>();

  const vault = useVaultQuery({ variables: { id: vaultId } });

  const { t } = useTranslation();
  const [amount, setAmount] = useState(10);
  const [currency, setCurrency] = useState<"CHF" | "EUR">("CHF");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [error, setError] = useState<ApiError | undefined>();

  const history = useHistory();
  useEffect(() => {
    if (response) {
      setAmount(response.order.amount);
      setCurrency(response.order.currency);
    }
  }, [response]);

  const submit = async () => {
    if (currency && amount && cryptoAddress) {
      setError(undefined);
      const response = await put<
        { currency: string; amount: number; cryptoAddress: string },
        undefined
      >("/bity/order", { currency, amount, cryptoAddress });
      if (response.error) {
        setError(response.error);
      } else {
        history.replace("/");
      }
    }
  };

  if (loading) {
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
                    value={currency}
                    onChange={(ev) => {
                      setCurrency(ev.target.value as "EUR" | "CHF");
                    }}
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
            {response?.order && (
              <>
                <div className={"alert alert-warning"}>
                  {t("app.order.warning_reset")}
                </div>
                <br />
              </>
            )}
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
              disabled={!currency || !amount || !cryptoAddress}
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
