import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ApiErrorAlert } from "../../../components/alerts/ApiErrorAlert";
import {
  ErrorType,
  OrderFrequency,
  OrderStatus,
  useAddOrderMutation,
  useBityStatusQuery,
  useOrderQuery,
  useUpdateOrderMutation,
  useVaultQuery,
} from "../../../generated/graphql";
import { BityStatus } from "../../../components/BityStatus";
import { LoadingBtn } from "../../../components/buttons/LoadingBtn";
import { OrderCard } from "../../../components/VaultOrders/OrderCard";
import { LoggedLayout } from "../../../layout/LoggedLayout";
import { LoadingCard } from "../../../components/LoadingCard";
import { useDebounce } from "../../../utils/hooks";

const sortedOrderFrequency = [
  OrderFrequency.Weekly,
  OrderFrequency.Monthly,
  OrderFrequency.Unique,
];

export function OrderSettings() {
  const { vaultId, orderId } = useParams<{
    vaultId: string;
    orderId?: string;
  }>();

  const { data: bityStatus, refetch: refetchBityStatus } = useBityStatusQuery();

  const vault = useVaultQuery({
    variables: { id: vaultId || "" },
  });
  const order = useOrderQuery({
    variables: {
      id: orderId || "",
    },
    skip: !orderId,
    onCompleted: (data) => {
      setName(data.orderTemplate.name);
      setAmount(data.orderTemplate.amount);
      setFrequency(data.orderTemplate.frequency);
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
  const [frequency, setFrequency] = useState<OrderFrequency>(
    OrderFrequency.Weekly
  );

  const [error, setError] = useState<ErrorType | undefined>();

  const navigate = useNavigate();

  const amountChanged =
    !order.data || order.data.orderTemplate.amount !== amount;
  const addressChanged = !!cryptoAddress;
  const amountIsValid = (amountChanged && !!amount) || !amountChanged;
  const addressIsValid =
    (!amountChanged &&
      !addressChanged &&
      order.data?.orderTemplate.activeOrder?.status !==
        OrderStatus.Cancelled) ||
    addressChanged; //If the order is cancelled, we don't allow submiting the form without setting the address

  const submit = useCallback(async () => {
    if (!amountIsValid || !addressIsValid) {
      return;
    }
    setError(undefined);
    if (orderId) {
      await updateOrder({
        variables: {
          orderTemplateId: orderId,
          data: { amount, cryptoAddress, name, frequency },
        },
        onCompleted: () => {
          navigate(`/`);
        },
        onError: (error) => {
          setError(error.message as ErrorType);
        },
      });
    } else {
      await placeOrder({
        variables: {
          vaultId: vaultId || "",
          data: { amount, cryptoAddress, name, frequency },
        },
        onCompleted: () => {
          navigate(`/`);
        },
        onError: (error) => {
          setError(error.message as ErrorType);
        },
      });
    }
    refetchBityStatus();
  }, [
    amountIsValid,
    addressIsValid,
    orderId,
    refetchBityStatus,
    updateOrder,
    amount,
    cryptoAddress,
    name,
    frequency,
    navigate,
    placeOrder,
    vaultId,
  ]);

  const loading = useDebounce(vault.loading || order.loading, 100, true);

  if (!vault.data || loading) {
    return (
      <LoggedLayout>
        <div className="row">
          <div className="col-md-12">
            <LoadingCard />
          </div>
        </div>
      </LoggedLayout>
    );
  }

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
            <div className="input-group mb-2">
              <span className="input-group-text">{t("app.order.name")}</span>
              <input
                className={"form-control"}
                onChange={(ev) => {
                  setName(ev.target.value);
                }}
                value={name}
                placeholder={t("app.order.name_placeholder")}
              />
            </div>
            <div className="input-group mb-2">
              <span className="input-group-text">{t("app.order.amount")}</span>
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
              <div className="input-group-text">
                {vault.data.vault.currency}
              </div>
            </div>
            <div className="input-group mb-2">
              <span className="input-group-text">
                {t("app.order.frequency")}
              </span>
              <select
                className={"form-select"}
                onChange={(ev) => {
                  setFrequency(ev.target.value as OrderFrequency);
                }}
                value={frequency}
              >
                {sortedOrderFrequency.map((frequency: OrderFrequency) => (
                  <option key={frequency} value={frequency}>
                    {t(`app.order.frequencies.${frequency}` as const)}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group mb-2">
              <span className="input-group-text">
                {t("app.order.crypto_address")}
              </span>
              <input
                className={"form-control"}
                onChange={(ev) => {
                  setCryptoAddress(ev.target.value);
                }}
                value={cryptoAddress}
                placeholder={t("app.order.crypto_address_desc")}
              />
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
                navigate("/");
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
      {order.data?.orderTemplate && (
        <div className="row my-4">
          <div className="col-12">
            <OrderCard order={order.data.orderTemplate} disabled noToolbar />
          </div>
        </div>
      )}
    </LoggedLayout>
  );
}
