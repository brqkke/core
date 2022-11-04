import React, { useCallback, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { LoggedLayout } from "../../../layout/LoggedLayout";
import { ApiErrorAlert } from "../../../components/alerts/ApiErrorAlert";
import {
  ErrorType,
  useAddOrderMutation,
  useBityStatusQuery,
  useOrderQuery,
  useUpdateOrderMutation,
  useVaultQuery,
} from "../../../generated/graphql";
import { BityStatus } from "../../../components/BityStatus";
import { LoadingBtn } from "../../../components/buttons/LoadingBtn";
import { OrderCard } from "../../../components/VaultOrders/OrderCard";

export function OrderSettings() {
  const { vaultId, orderId } = useParams<{
    vaultId: string;
    orderId?: string;
  }>();

  const { data: bityStatus, refetch: refetchBityStatus } = useBityStatusQuery();

  const vault = useVaultQuery({
    variables: { id: vaultId },
  });
  const order = useOrderQuery({
    variables: {
      id: orderId || "",
    },
    skip: !orderId,
    onCompleted: (data) => {
      setName(data.orderTemplate.name);
      setAmount(data.orderTemplate.amount);
      setCryptoAddress("");
    },
  });
  const [placeOrder, { loading: addLoading }] = useAddOrderMutation();
  const [updateOrder, { loading: updateLoading }] = useUpdateOrderMutation();
  const saveLoading = addLoading || updateLoading;

  const { t } = useTranslation();
  const [amount, setAmount] = useState(10);
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState<ErrorType | undefined>();

  const history = useHistory();

  const submit = useCallback(async () => {
    setError(undefined);
    if (orderId) {
      await updateOrder({
        variables: {
          orderTemplateId: orderId,
          data: { amount, cryptoAddress, name },
        },
        onError: (error) => {
          setError(error.message as ErrorType);
        },
      });
    } else {
      await placeOrder({
        variables: {
          vaultId,
          data: { amount, cryptoAddress, name },
        },
        onCompleted: () => {
          history.replace(`/`);
        },
        onError: (error) => {
          setError(error.message as ErrorType);
        },
      });
    }
    refetchBityStatus();
  }, [
    orderId,
    refetchBityStatus,
    updateOrder,
    amount,
    cryptoAddress,
    name,
    placeOrder,
    vaultId,
    history,
  ]);

  if (vault.loading || !vault.data || order.loading) {
    return (
      <LoggedLayout>
        <div className="row">
          <div className="col-md-6">
            <p>{t("app.loading")}</p>
          </div>
        </div>
      </LoggedLayout>
    );
  }

  const amountChanged =
    !order.data || order.data.orderTemplate.amount !== amount;
  const addressChanged = !!cryptoAddress;
  const amountIsValid = (amountChanged && !!amount) || !amountChanged;
  const addressIsValid = (!amountChanged && !addressChanged) || addressChanged;

  return (
    <LoggedLayout>
      <div className="row">
        <div className="col-12">
          <h3>{vault.data.vault.name}</h3>
          {orderId ? (
            <p>
              {t("app.order.editing", { name: order.data?.orderTemplate.name })}
            </p>
          ) : (
            <p> {t("app.order.creating", { name: vault.data.vault.name })}</p>
          )}
        </div>
      </div>
      {bityStatus && !bityStatus.me.bityTokenStatus.linked && (
        <div className="row">
          <BityStatus bityStatus={bityStatus.me.bityTokenStatus} />
        </div>
      )}
      {order.data?.orderTemplate && (
        <div className="row my-2">
          <div className="col-12">
            <OrderCard order={order.data.orderTemplate} disabled noToolbar />
          </div>
        </div>
      )}
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
                    {t("app.order.name")}
                  </span>
                </div>
                <input
                  className={"form-control"}
                  onChange={(ev) => {
                    setName(ev.target.value);
                  }}
                  value={name}
                  placeholder={t("app.order.name_placeholder")}
                />
              </div>
            </div>
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
            {order.data?.orderTemplate && (amountChanged || addressChanged) && (
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
                history.push("/");
              }}
            >
              {t("app.order.go_back")}
            </button>
            <LoadingBtn
              level={"primary"}
              text={t("app.order.save")}
              loading={saveLoading}
              disabled={!addressIsValid || !amountIsValid}
              type={"submit"}
              className={"ms-2"}
            />
          </form>
        </div>
      </div>
    </LoggedLayout>
  );
}
