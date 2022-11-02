import React, { useCallback, useState } from "react";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  text: string;
  title: string;
  onClose: () => void;
  onConfirm: () => unknown | Promise<unknown>;
  confirmBtnText: string;
  confirmBtnLevel: "success" | "warning" | "primary" | "danger";
  confirmBtnSize?: "sm" | "lg" | "md" | "xs";
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
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const confirm = useCallback(async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  }, [onConfirm]);

  return (
    <Modal
      text={text}
      title={title}
      open={open}
      onClose={onClose}
      confirmBtnProps={{
        onClick: confirm,
        level: confirmBtnLevel,
        size: confirmBtnSize,
        loading,
        text: confirmBtnText,
        disabled: loading,
        type: "button",
      }}
    />
  );
}
