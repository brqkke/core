import { ApiError } from "../../api/call";
import { Alert } from "./Alert";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import isArray from "lodash/isArray";
import { ErrorType } from "../../generated/graphql";

export function ApiErrorAlert({ error }: { error: ApiError | ErrorType }) {
  const { t } = useTranslation();
  const messages = useMemo<string[]>(() => {
    if (typeof error === "string") {
      if (Object.values(ErrorType).includes(error as ErrorType)) {
        return [t(`app.error.${error}`)];
      } else {
        return [error];
      }
    }
    if (typeof error.error === "string") {
      return [error.error];
    }
    return (isArray(error.error) ? error.error : [error.error]).map((err) => {
      switch (err.code) {
        case "input_payment_information_required":
          return t("app.bity.error.input_payment_information_required");
        case "cant_refresh_token":
          return t("app.bity.error.cant_refresh_token");
        default:
          return err.message || err.code;
      }
    });
  }, [error, t]);
  return (
    <>
      {messages.map((message) => (
        <Alert key={message} level={"danger"} message={message} />
      ))}
    </>
  );
}
