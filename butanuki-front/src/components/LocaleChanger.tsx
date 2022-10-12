import { useTranslation } from "react-i18next";
import { useConfigContext } from "../context/ConfigContext";
import React, { useMemo } from "react";
import { useUpdateLocaleMutation } from "../generated/graphql";

export function LocaleChanger({ logged = false }) {
  const { i18n } = useTranslation();
  const [updateLocale] = useUpdateLocaleMutation({
    onCompleted: (data) => {
      if (data.updateLocale.locale) {
        i18n.changeLanguage(data.updateLocale.locale);
      }
    },
  });
  const { availableLocales } = useConfigContext();

  const setLangCookie = (locale: string) => {
    window.document.cookie =
      "locale=" + locale + ";" + new Date(Date.now() + 1000 * 3600 * 24 * 365);
  };

  const render = useMemo(() => {
    return availableLocales
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
                  updateLocale({ variables: { locale: locale } });
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
      ));
  }, [availableLocales, i18n, logged, updateLocale]);

  return <div>[{render}]</div>;
}
