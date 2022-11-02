import { useTranslation } from "react-i18next";
import { ConfirmModal } from "./ConfirmModal";
import React from "react";
import { MutationResult } from "@apollo/client/react/types/types";

export const ConfirmDeleteModal = ({
  open,
  onClose,
  onDelete,
  mutationResult,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => unknown | Promise<unknown>;
  mutationResult: MutationResult<unknown>;
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
      mutationResult={mutationResult}
    />
  );
};
