import { Navigate, useNavigate } from "react-router";
import React, { useState } from "react";
import { ErrorType, useLinkBityMutation } from "../../../generated/graphql";
import { useTranslation } from "react-i18next";
import { ApiErrorAlert } from "../../../components/alerts/ApiErrorAlert";
import { LinkBityBtn } from "../../../components/buttons/BityBtn/LinkBityBtn";
import { useEffectOnce } from "../../../utils/hooks";

const useUrlSearchParams = () => {
  return useState(() => new URLSearchParams(location.search))[0];
};

const useBityOAuthCodeValidation = () => {
  const [linkBityWithCode, result] = useLinkBityMutation();

  useEffectOnce(() => {
    const url = window.document.location.href;
    const path = url.replace(window.document.location.origin, "");
    linkBityWithCode({ variables: { redirectedFrom: path } }).catch(() => {});
  });

  const error = useError(result.error?.message);
  return {
    loading: result.loading,
    error,
    data: result.data,
    called: result.called,
  };
};

const useError = (
  mutationErrorMessage?: string
): { mutationError?: ErrorType | string; urlError?: string } => {
  const url = useUrlSearchParams();
  const urlError = url.get("error_description") || undefined;

  const mutationError: ErrorType | string | undefined =
    mutationErrorMessage && mutationErrorMessage in ErrorType
      ? (mutationErrorMessage as ErrorType)
      : mutationErrorMessage;

  return {
    mutationError,
    urlError,
  };
};

export function LinkBity() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    loading,
    data,
    called,
    error: { mutationError, urlError },
  } = useBityOAuthCodeValidation();

  if (loading || !called) {
    return (
      <div className="spinner-border text-warning" role="status">
        <span className="sr-only"></span>
      </div>
    );
  }

  if (data?.linkBity.bityTokenStatus.linked) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      {mutationError && <ApiErrorAlert error={mutationError} />}
      <br />
      {urlError && <ApiErrorAlert error={urlError} />}
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
    </>
  );
}
