import { useHistory, useParams } from "react-router";
import { useEffect } from "react";
import { post } from "../api/call";
import { useTranslation } from "react-i18next";

export function LoginValidate() {
  const params = useParams<{ token: string; email: string }>();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const r = await post<
        { tempCode: string; email: string },
        { sessionToken: string; success: boolean }
      >("/auth/login/email/verify", {
        tempCode: params.token,
        email: params.email,
      });
      if (r.response && r.response.success) {
        window.localStorage.setItem("sessionKey", r.response.sessionToken);
        history.replace("/");
      } else {
        history.replace("/login");
      }
    })();
  }, [params, history]);
  return <p>{t("app.loading")}</p>;
}
