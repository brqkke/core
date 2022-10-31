import { LoadingBtn, LoadingBtnProps } from "./LoadingBtn";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import BSModal from "react-bootstrap/Modal";

interface ModalProps<T> {
  open: boolean;
  text: string;
  title: string;
  onClose: () => void;
  confirmBtnProps: LoadingBtnProps<T>;
}

export function Modal<T>(props: ModalProps<T>) {
  const { t } = useTranslation();
  return (
    <BSModal show={props.open} onHide={props.onClose}>
      <BSModal.Header closeButton>
        <BSModal.Title>{props.title}</BSModal.Title>
      </BSModal.Header>
      <BSModal.Body>
        <p>{props.text}</p>
      </BSModal.Body>
      <BSModal.Footer>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={props.onClose}
        >
          {t("app.action.cancel")}
        </button>
        <LoadingBtn {...props.confirmBtnProps} />
      </BSModal.Footer>
    </BSModal>
  );
}

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

const DeleteLoadingBtn = ({
  onClick,
}: {
  onClick: () => void | Promise<void>;
}) => <LoadingBtn size={"xs"} level={"danger"} onClick={onClick} text={"X"} />;

export const DeleteBtnWithConfirm = ({
  onDelete,
}: {
  onDelete: () => unknown | Promise<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DeleteLoadingBtn onClick={() => setOpen(true)} />
      <ConfirmDeleteModal
        open={open}
        onClose={() => setOpen(false)}
        onDelete={onDelete}
      />
    </>
  );
};
