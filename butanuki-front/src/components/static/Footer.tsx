import { useTranslation } from "react-i18next";
import { usePublicPageLink } from "../../utils/i18n";
import React from "react";

export const Footer = React.memo(() => {
  const { t } = useTranslation();
  const getUrl = usePublicPageLink();
  return (
    <footer className={"text-end m-4"}>
      <a href={getUrl("about")} target="_top">
        {t("nav.about")}
      </a>{" "}
      |{" "}
      <a href={getUrl("help")} target="_top">
        {t("nav.help")}
      </a>{" "}
      |{" "}
      <a href="https://twitter.com/butanuki21" target="twitter">
        Twitter
      </a>{" "}
      |{" "}
      <a href="https://t.me/Butanuki" target={"_blank"}>
        Telegram
      </a>
      <br />
      <br />
      &copy; Butanuki.com
    </footer>
  );
});
