import { ApiError } from "../../api/call";
import { Alert } from "./Alert";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ErrorType } from "../../generated/graphql";

export function ApiErrorAlert({
  error,
}: {
  error: ApiError | ErrorType | string;
}) {
  const { t, i18n } = useTranslation();
  const messages = useMemo(() => {
    if (typeof error === "string") {
      if (Object.values(ErrorType).includes(error as ErrorType)) {
        const key = `app.error.${error as ErrorType}` as const;
        return [{ key }];
      } else {
        return [error];
      }
    }
    if (typeof error.error === "string") {
      return [error.error];
    }
    return (Array.isArray(error.error) ? error.error : [error.error]).map(
      (err) => {
        switch (err.code) {
          case "input_payment_information_required":
            return {
              key: `app.error.${ErrorType.NeedVerifiedBityAccount}` as const,
            };
          case "cant_refresh_token":
            return {
              key: `app.error.${ErrorType.CantRefreshBityToken}` as const,
            };
          default:
            return err.message || err.code;
        }
      }
    );
  }, [error]);
  return (
    <>
      {messages.map((message) =>
        typeof message === "string" ? (
          <Alert key={message} level={"danger"} message={message} />
        ) : (
          <Alert key={message.key} level={"danger"}>
            <Trans
              i18nKey={message.key}
              t={t}
              i18n={i18n}
              components={{
                kycLink: (
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    href="https://kyc.my.bity.com/"
                    target={"_blank"}
                    rel="noreferrer"
                  />
                ),
              }}
            />
          </Alert>
        )
      )}
    </>
  );
}
