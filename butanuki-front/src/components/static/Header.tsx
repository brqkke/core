import { usePublicPageLink } from "../../utils/i18n";
import { useTranslation } from "react-i18next";
import React from "react";

export const Header = React.memo(() => {
  const { t } = useTranslation();
  const getUrl = usePublicPageLink();
  return (
    <div className="nav">
      <div className="nav-header">
        <div className="nav-title">
          <a href={getUrl("root")} target="_top">
            <img
              src={"/images/logo_butanuki.png"}
              alt="logo"
              width="171"
              height="28"
            />
          </a>
        </div>
      </div>
      <div className="nav-links">
        <a href={getUrl("help")} target="_top">
          {t("nav.help")}
        </a>
        <a href="https://twitter.com/butanuki21" target="twitter">
          Twitter
        </a>
        <a href="https://t.me/Butanuki" target={"_blank"}>
          Telegram
        </a>
      </div>
    </div>
  );
});
