import { useCallback } from "react";
import { deleteCall, get } from "../api/call";
import { useTranslation } from "react-i18next";

const BITY_GET_LINK_URL_ENDPOINT = "/bity/link/";

function ClickHere(props: {
  onClick: () => Promise<void>;
  level: "success" | "warning" | "primary" | "danger";
}) {
  const { t } = useTranslation();
  return (
    <button onClick={props.onClick} className={`btn btn-${props.level}`}>
      {t("app.home.click_here")}
    </button>
  );
}

export function BityStatus({
  bityStatus,
  onDelete,
}: {
  bityStatus:
    | {
        linked: boolean;
        linkStatus: "ACTIVE" | "BROKEN" | "NEED_REFRESH_RETRY";
      }
    | null
    | undefined;
  onDelete: () => void;
}) {
  const linkAccount = useCallback(async () => {
    const r = await get<{ redirectUrl: string }>(BITY_GET_LINK_URL_ENDPOINT);
    if (r.response) {
      window.location.href = r.response.redirectUrl;
    }
  }, []);

  const unlinkAccount = useCallback(async () => {
    await deleteCall<undefined>(BITY_GET_LINK_URL_ENDPOINT);
    onDelete();
  }, [onDelete]);

  const { t } = useTranslation();

  if (bityStatus === undefined) {
    return <p>{t("app.loading")}</p>;
  }

  if (bityStatus === null) {
    return <p>{t("app.error.loading")}</p>;
  }

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
