import React, { Suspense } from "react";
import {
  BityPaymentDetails,
  OrderStatus,
  OrderTemplateInfosFragment,
  useDeleteOrderMutation,
} from "../../generated/graphql";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteBtnWithConfirm } from "../buttons/DeleteBtnWithConfirm";
import { formatAmount } from "../../utils/i18n";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";

const FontAwesomeIcon = React.lazy(() => import("../icon/FontAwesome"));

const RenderIbanWithSpaces = React.memo((props: { iban: string }) => {
  const { iban } = props;
  if (!iban) {
    return null;
  }
  const parts = iban.replaceAll(" ", "").match(/.{1,4}/g);
  if (!parts) {
    return <>{iban}</>;
  }
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span style={{ display: "inline-block", width: "4px" }} />
          )}
        </React.Fragment>
      ))}
    </>
  );
});
const PaymentDetails = React.memo(
  ({
    transferLabel,
    details,
    orderStatus,
  }: {
    details: BityPaymentDetails;
    transferLabel: string;
    orderStatus: OrderStatus;
  }) => {
    const { t } = useTranslation();
    return (
      <div>
        <h5>{t("app.order.payment_informations")}</h5>
        <div className="row">
          <div className="col-md-12">
            <p
              className="mb-0"
              style={{
                display: "inline-block",
              }}
            >
              {t("app.order.reference")}:&nbsp;
            </p>
            <p
              className="text-muted mb-0"
              style={{
                display: "inline-block",
              }}
            >
              <strong>{transferLabel}</strong>
              {orderStatus === OrderStatus.Cancelled && (
                <span className="text-danger">
                  <>
                    {" "}
                    <Suspense fallback={null}>
                      <FontAwesomeIcon icon={faTriangleExclamation} />
                    </Suspense>
                    &nbsp;({t("app.order.cancelled_warning")})
                  </>
                </span>
              )}
            </p>
          </div>
        </div>
        {orderStatus !== OrderStatus.Cancelled && (
          <>
            <hr />
            <div className="row">
              <div className="col-lg-6 col-md-8">
                <div className="row">
                  <div className="col-md-3">
                    <p className="mb-0">IBAN</p>
                  </div>
                  <div className="col-md-9">
                    <p className="text-muted">
                      <RenderIbanWithSpaces iban={details.iban || ""} />
                    </p>
                  </div>
                </div>
                {/*<hr />*/}
                <div className="row">
                  <div className="col-md-3">
                    <p className="mb-0">BIC/SWIFT</p>
                  </div>
                  <div className="col-md-9">
                    <p className="text-muted">{details.swift_bic}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-4">
                {/*<hr />*/}
                <div className="row">
                  <div className="col-md-3">
                    <p className="mb-0">Recipient</p>
                  </div>
                  <div className="col-md-9">
                    <p
                      className="text-muted mb-0"
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "break-spaces",
                      }}
                    >
                      {details.recipient &&
                        details.recipient.split(",").map((part, i, parts) => {
                          const words = part.trim();
                          return (
                            <React.Fragment key={i}>
                              {words}
                              {i < parts.length - 1 && <br />}
                            </React.Fragment>
                          );
                        })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);
export const OrderCard = ({
  order,
  disabled,
  noToolbar,
}: {
  order: OrderTemplateInfosFragment;
  disabled: boolean;
  noToolbar?: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const [deleteOrder, deleteOrderResult] = useDeleteOrderMutation({
    update: (cache, { data }) => {
      if (data?.deleteOrderTemplate.id) {
        cache.evict({ id: cache.identify(data.deleteOrderTemplate) });
      }
    },
    variables: {
      orderTemplateId: order.id,
    },
  });

  return (
    <div
      className={`card ${
        order.activeOrder?.status !== OrderStatus.Cancelled
          ? "active-order"
          : ""
      }`}
    >
      <div className="card-header">
        <div className="row">
          <div className="col-12">
            <h4 className={"mb-0"}>📆 {order.name}</h4>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 col-lg-4">
            <div className="row">
              <div className="col-sm-6">
                <p className="mb-0">{t("app.order.amount")}</p>
              </div>
              <div className="col-sm-6">
                <p className="text-muted mb-md-0">
                  {order.activeOrder &&
                    formatAmount(
                      order.amount,
                      order.activeOrder.currency,
                      i18n.language as "en" | "fr"
                    )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="row">
              <div className="col-sm-6">
                <p className="mb-0">{t("app.order.crypto_address")}</p>
              </div>
              <div className="col-sm-6">
                <p className="text-muted mb-lg-0">
                  {order.activeOrder?.redactedCryptoAddress}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 col-lg-4">
            <div className="row">
              <div className="col-sm-6">
                <p className="mb-0">{t("app.order.frequency")}</p>
              </div>
              <div className="col-sm-6">
                <p className="text-muted mb-0">
                  {t(`app.order.frequencies.${order.frequency}` as const)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-12 mt-2">
            {order.activeOrder?.bankDetails && (
              <PaymentDetails
                orderStatus={order.activeOrder.status}
                details={order.activeOrder.bankDetails}
                transferLabel={order.activeOrder.transferLabel}
              />
            )}
          </div>
        </div>
      </div>
      {!noToolbar && (
        <div className={"card-footer justify-content-end d-flex"}>
          <Link
            to={`/vault/${order.vaultId}/edit-order/${order.id}`}
            className={`btn btn-outline-primary ${disabled ? "disabled" : ""}`}
          >
            {t("app.order.change_amount")}
          </Link>
          <DeleteBtnWithConfirm
            onDelete={deleteOrder}
            mutationResult={deleteOrderResult}
            label={t("app.action.delete")}
            className={"ms-2"}
          />
        </div>
      )}
    </div>
  );
};
