import {
  useBityLinkUrlLazyQuery,
  useUnlinkBityMutation,
} from "../../../generated/graphql";
import { useCallback } from "react";
import { LoadingBtn } from "../LoadingBtn";
import { useTranslation } from "react-i18next";

export const LinkBityBtn = ({
  variant = "click-here",
  colorVariant,
}: {
  variant?: "click-here" | "try-again";
  colorVariant?: "success" | "danger" | "warning";
}) => {
  const { t } = useTranslation();
  const [loadLinkUrl, { loading }] = useBityLinkUrlLazyQuery({
    fetchPolicy: "network-only",
  });
  const linkAccount = useCallback(async () => {
    const result = await loadLinkUrl();
    if (result.data) {
      window.location.href = result.data.linkUrl;
    }
  }, [loadLinkUrl]);

  switch (variant) {
    case "try-again":
      return (
        <LoadingBtn
          onClick={linkAccount}
          level={colorVariant || "warning"}
          text={t("app.home.try_again")}
          loading={loading}
        />
      );
    case "click-here":
    default:
      return (
        <LoadingBtn
          onClick={linkAccount}
          level={colorVariant || "success"}
          text={t("app.home.click_here")}
          loading={loading}
        />
      );
  }
};

export const UnlinkBityBtn = () => {
  const [unlinkAccount, { loading: unlinkLoading }] = useUnlinkBityMutation();
  const { t } = useTranslation();
  return (
    <LoadingBtn
      onClick={unlinkAccount}
      level={"danger"}
      loading={unlinkLoading}
      text={t("app.home.click_here")}
    />
  );
};
