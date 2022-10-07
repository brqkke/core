// import { MainLayout } from "../layout/MainLayout";
// import { useState } from "react";
// import { post } from "../api/call";
// import { Alert } from "../components/Alert";
// import { Trans, useTranslation } from "react-i18next";
// import { LocaleChanger } from "../components/LocaleChanger";
import { useEffect } from "react";
import { usePublicPageLink } from "../utils/i18n";
// import { Redirect } from "react-router";

export function Login() {
  const getUrl = usePublicPageLink();
  const link = getUrl("login");
  useEffect(() => {
    window.location.replace(link);
  }, [link]);
  return <a href={link}>Login page</a>;
  /*const [email, setEmail] = useState("");
  const [acceptTOU, setAcceptTOU] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean | string>();
  const [success, setSuccess] = useState<boolean>();
  const { t } = useTranslation();

  const submit = async () => {
    if (loading || !acceptTOU) {
      return;
    }

    setSuccess(false);
    setError(false);
    setLoading(true);

    const r = await post<{ email: string }, {}>("/auth/login/email", {
      email,
    });
    setLoading(false);
    if (r.error) {
      console.log(r);
      setError(r.error.error || true);
    } else {
      setSuccess(true);
    }
    setEmail("");
  };
  return (
    <MainLayout>
      <LocaleChanger />
      <h2>Login</h2>
      <div className="row">
        <div className="col-md-4">
          {error && (
            <Alert
              message={error === true ? "An error occured" : error}
              level={"danger"}
            />
          )}
          {success && (
            <Alert
              message={"A login link was sent to your address"}
              level={"success"}
            />
          )}
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
              return false;
            }}
          >
            <p>{t("app.login.enter_email")}</p>

            <input
              type={"email"}
              className={"form-control"}
              name={"email"}
              placeholder={t("app.login.email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <br />
            <div className="form-check">
              <input
                checked={acceptTOU}
                className="form-check-input"
                type="checkbox"
                onChange={(ev) => setAcceptTOU(ev.target.checked)}
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                <Trans i18nKey={"app.login.accept_tou"}>
                  Accept the
                  <a href={t("nav.touLink")} target={"_blank"} rel="noreferrer">
                    Terms Of Use
                  </a>
                </Trans>
              </label>
            </div>
            <button
              disabled={loading || !email || !acceptTOU}
              className={"btn btn-primary"}
            >
              {t("app.login.receive_link")}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );*/
}
