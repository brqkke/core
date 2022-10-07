import { ApiError } from "../api/call";
import { Alert } from "./Alert";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function ApiErrorAlert({ error }: { error: ApiError }) {
  const { t } = useTranslation();
  const messages = useMemo<string[]>(() => {
    if (typeof error.error === "string") {
      return [error.error];
    }
    return error.error.map((err) => {
      switch (err.code) {
        case "input_payment_information_required":
          return t("app.bity.error.input_payment_information_required");
        default:
          return err.message;
      }
    });
  }, [error, t]);
  return (
    <>
      {messages.map((message) => (
        <Alert level={"danger"} message={message} />
      ))}
    </>
  );
}
