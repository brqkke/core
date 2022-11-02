import { useTranslation } from "react-i18next";
import { ConfirmModal } from "./ConfirmModal";
import React from "react";

export const ConfirmDeleteModal = ({
  open,
  onClose,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => unknown | Promise<unknown>;
}) => {
  const { t } = useTranslation();
  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onDelete}
      confirmBtnText={t("app.action.delete")}
      confirmBtnLevel="danger"
      text={t("app.action.confirmDelete")}
      confirmBtnSize={"md"}
      title={t("app.action.delete")}
    />
  );
};
