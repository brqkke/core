import React, { useEffect } from "react";
import { Modal } from "./Modal";
import { MutationResult } from "@apollo/client/react/types/types";
import { ApiErrorAlert } from "../alerts/ApiErrorAlert";
import { ErrorType } from "../../generated/graphql";

interface ConfirmModalProps {
  open: boolean;
  text: string;
  title: string;
  onClose: () => void;
  onConfirm: () => unknown | Promise<unknown>;
  confirmBtnText: string;
  confirmBtnLevel: "success" | "warning" | "primary" | "danger";
  confirmBtnSize?: "sm" | "lg" | "md" | "xs";
  mutationResult: MutationResult<unknown>;
}

export function ConfirmModal({
  onConfirm,
  confirmBtnText,
  text,
  confirmBtnSize,
  confirmBtnLevel,
  onClose,
  title,
  open,
  mutationResult: { loading, error, reset },
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Modal
      title={title}
      open={open}
      onClose={onClose}
      confirmBtnProps={{
        onClick: onConfirm,
        level: confirmBtnLevel,
        size: confirmBtnSize,
        loading,
        text: confirmBtnText,
        disabled: loading,
        type: "button",
      }}
    >
      {error && <ApiErrorAlert error={error.message as ErrorType} />}
      <p>{text}</p>
    </Modal>
  );
}
