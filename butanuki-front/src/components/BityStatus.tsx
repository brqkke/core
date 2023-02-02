import { Trans, useTranslation } from "react-i18next";
import { BityLinkStatus, TokenStatus } from "../generated/graphql";
import { LinkBityBtn, UnlinkBityBtn } from "./buttons/BityBtn/LinkBityBtn";
import React from "react";

export const BityStatus = React.memo(
  ({ bityStatus }: { bityStatus: BityLinkStatus }) => {
    const { t, i18n } = useTranslation();

    const linkBtn = (
      <p>
        {t("app.home.bity.not_linked")} <LinkBityBtn />{" "}
        {t("app.home.bity.to_link")}
        <br />
        <Trans
          i18nKey="app.home.bity.create_bity"
          t={t}
          i18n={i18n}
          components={{
            link1: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                className="btn btn-sm btn-success"
                href={"https://buy.btnk.ch"}
                target={"_blank"}
                rel="noreferrer"
              />
            ),
          }}
        />
      </p>
    );
    const unlinkBtn = (
      <p>
        {t("app.home.bity.linked")}, <UnlinkBityBtn />{" "}
        {t("app.home.bity.to_unlink")}
      </p>
    );
    const linkBroken = (
      <div className={"alert alert-danger"}>
        {t("app.home.bity.broken")}
        <br />
        <LinkBityBtn variant={"click-here"} colorVariant={"success"} />{" "}
        {t("app.home.bity.to_link")}
      </div>
    );
    if (!bityStatus.linked) {
      return linkBtn;
    } else {
      if (bityStatus.linkStatus === TokenStatus.Broken) {
        return linkBroken;
      } else {
        return unlinkBtn;
      }
    }
  }
);
