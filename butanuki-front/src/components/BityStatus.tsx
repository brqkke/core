import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  BityLinkStatus,
  useBityLinkUrlLazyQuery,
  useUnlinkBityMutation,
} from "../generated/graphql";
import { LoadingBtn } from "./LoadingBtn";
import { LinkBityBtn } from "./LinkBityBtn";

export function BityStatus({ bityStatus }: { bityStatus: BityLinkStatus }) {
  const [loadLinkUrl] = useBityLinkUrlLazyQuery();
  const [unlinkAccount] = useUnlinkBityMutation();
  const { t } = useTranslation();

  const linkAccount = useCallback(async () => {
    const result = await loadLinkUrl();
    if (result.data) {
      window.location.href = result.data.linkUrl;
    }
  }, [loadLinkUrl]);

  const linkBtn = (
    <p>
      {t("app.home.bity.not_linked")} <LinkBityBtn />{" "}
      {t("app.home.bity.to_link")}
    </p>
  );
  const unlinkBtn = (
    <p>
      {t("app.home.bity.linked")},{" "}
      <LoadingBtn
        onClick={unlinkAccount}
        level={"danger"}
        text={t("app.home.click_here")}
      />{" "}
      {t("app.home.bity.to_unlink")}
    </p>
  );
  const linkBroken = (
    <div className={"alert alert-danger"}>
      {t("app.home.bity.broken")}
      <br />
      <LoadingBtn
        onClick={linkAccount}
        level={"success"}
        text={t("app.home.click_here")}
      />{" "}
      {t("app.home.bity.to_link")}
    </div>
  );
  if (!bityStatus.linked) {
    return linkBtn;
  } else {
    if (bityStatus.linkStatus === "BROKEN") {
      return linkBroken;
    } else {
      return unlinkBtn;
    }
  }
}
