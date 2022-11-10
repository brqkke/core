import { useTranslation } from "react-i18next";
import { useConfigContext } from "../../context/ConfigContext";
import React from "react";
import { useUpdateLocaleMutation } from "../../generated/graphql";

const setLangCookie = (locale: string) => {
  window.document.cookie =
    "locale=" + locale + ";" + new Date(Date.now() + 1000 * 3600 * 24 * 365);
};

export const LocaleChanger = React.memo(
  ({ logged = false }: { logged: boolean }) => {
    const { i18n } = useTranslation();
    const [updateLocale, result] = useUpdateLocaleMutation();
    const { availableLocales } = useConfigContext();

    const selector = availableLocales
      .map((locale) => {
        if (i18n.language === locale) {
          return <span key={locale}>{locale.toUpperCase()}</span>;
        } else {
          return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              key={locale}
              onClick={async (ev) => {
                ev.preventDefault();
                if (logged) {
                  await updateLocale({ variables: { locale: locale } });
                }
                i18n.changeLanguage(locale);
                setLangCookie(locale);
                return false;
              }}
              href={"#"}
            >
              {locale.toUpperCase()}
            </a>
          );
        }
      })
      .map((l, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <>&nbsp;|&nbsp;</> : ""}
          {l}
        </React.Fragment>
      ));

    return <div className={"mt-3"}>[{selector}]</div>;
  }
);
