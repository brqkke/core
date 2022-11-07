import { Navigate, useLocation, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { ErrorType, useLinkBityMutation } from "../../../generated/graphql";
import { useTranslation } from "react-i18next";
import { ApiErrorAlert } from "../../../components/alerts/ApiErrorAlert";
import { Alert } from "../../../components/alerts/Alert";
import { LinkBityBtn } from "../../../components/buttons/BityBtn/LinkBityBtn";

export function LinkBity() {
  const location = useLocation();
  const [urlSearchParams] = useState(new URLSearchParams(location.search));
  const [linkBityWithCode, result] = useLinkBityMutation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const url = window.document.location.href;
    const path = url.replace(window.document.location.origin, "");
    linkBityWithCode({ variables: { redirectedFrom: path } });
  }, [linkBityWithCode, urlSearchParams]);

  if (result.loading || !result.called) {
    return (
      <div className="spinner-border text-warning" role="status">
        <span className="sr-only"></span>
      </div>
    );
  }

  if (result.data?.linkBity.bityTokenStatus.linked) {
    return <Navigate to={"/"} />;
  }

  const urlError = urlSearchParams.get("error_description");
  let responseErrorText = result.error?.message;
  let standardError =
    responseErrorText && responseErrorText in ErrorType
      ? (responseErrorText as ErrorType)
      : undefined;
  if (responseErrorText && responseErrorText in ErrorType) {
    const errorType: ErrorType = responseErrorText as ErrorType;
    responseErrorText = t(`app.error.${errorType}`);
  }

  return (
    <p>
      {standardError ? (
        <ApiErrorAlert error={standardError} />
      ) : (
        responseErrorText && (
          <ApiErrorAlert
            error={{ status: "unknown", error: responseErrorText }}
          />
        )
      )}
      <br />
      {urlError && <Alert message={urlError} level={"danger"} />}
      <br />
      <button
        type={"button"}
        className={"btn btn-secondary"}
        onClick={() => {
          navigate("/");
        }}
      >
        {t("app.order.go_back")}
      </button>{" "}
      <LinkBityBtn variant={"try-again"} />
    </p>
  );
}
