import { useTranslation } from "react-i18next";
import { usePublicPageLink } from "../utils/i18n";

export const Header = () => {
  const { t } = useTranslation();
  const getUrl = usePublicPageLink();
  return (
    <div className="nav">
      <input type="checkbox" id="nav-check" />
      <div className="nav-header">
        <div className="nav-title">
          <a href={getUrl("root")} target="_top">
            Butanuki
          </a>
        </div>
      </div>
      <div className="nav-links">
        <a href={getUrl("about")} target="_top">
          {t("nav.about")}
        </a>
        <a href={getUrl("help")} target="_top">
          {t("nav.help")}
        </a>
        <a href="https://twitter.com/butanuki21" target="twitter">
          Twitter
        </a>
      </div>
    </div>
  );
};
