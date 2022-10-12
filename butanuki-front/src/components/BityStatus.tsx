import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  BityLinkStatus,
  useBityLinkUrlLazyQuery,
  useUnlinkBityMutation,
} from "../generated/graphql";

function ClickHere<T>(props: {
  onClick: () => Promise<T>;
  level: "success" | "warning" | "primary" | "danger";
}) {
  const { t } = useTranslation();
  return (
    <button onClick={props.onClick} className={`btn btn-${props.level}`}>
      {t("app.home.click_here")}
    </button>
  );
}

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
      {t("app.home.bity.not_linked")}{" "}
      <ClickHere onClick={linkAccount} level={"success"} />{" "}
      {t("app.home.bity.to_link")}
    </p>
  );
  const unlinkBtn = (
    <p>
      {t("app.home.bity.linked")},{" "}
      <ClickHere onClick={unlinkAccount} level={"danger"} />{" "}
      {t("app.home.bity.to_unlink")}
    </p>
  );
  const linkBroken = (
    <div className={"alert alert-danger"}>
      {t("app.home.bity.broken")}
      <br />
      <ClickHere onClick={linkAccount} level={"success"} />{" "}
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
