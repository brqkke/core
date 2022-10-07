import { useTranslation } from "react-i18next";
import { useConfigContext } from "../context/ConfigContext";
import { put } from "../api/call";
import React from "react";

export function LocaleChanger({ logged = false }) {
  const { i18n } = useTranslation();

  const { availableLocales } = useConfigContext();

  const setLangCookie = (locale: string) => {
    window.document.cookie =
      "locale=" + locale + ";" + new Date(Date.now() + 1000 * 3600 * 24 * 365);
  };
  return (
    <div>
      [
      {availableLocales
        .map((locale, i) => {
          console.log(locale, i18n.language);
          if (i18n.language === locale) {
            return <span key={locale}>{locale.toUpperCase()}</span>;
          } else {
            return (
              <a
                key={locale}
                onClick={(ev) => {
                  ev.preventDefault();
                  if (logged) {
                    put<{ locale: string }, { locale: string }>(
                      "/auth/me/locale",
                      {
                        locale,
                      }
                    ).then((r) => {
                      if (r.response) {
                        i18n.changeLanguage(r.response.locale);
                        setLangCookie(r.response.locale);
                      }
                    });
                  } else {
                    i18n.changeLanguage(locale);
                    setLangCookie(locale);
                  }

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
        ))}
      ]
    </div>
  );
}
