import { useTranslation } from "react-i18next";
import { usePublicPageLink } from "../../utils/i18n";

export const Footer = () => {
  const { t } = useTranslation();
  const getUrl = usePublicPageLink();
  return (
    <>
      <footer>
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
        </a>
      </footer>
      <footer>&copy; Butanuki.com</footer>
    </>
  );
};
