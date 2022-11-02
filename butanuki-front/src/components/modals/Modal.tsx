import { LoadingBtn, LoadingBtnProps } from "../buttons/LoadingBtn";
import React from "react";
import { useTranslation } from "react-i18next";
import BSModal from "react-bootstrap/Modal";

interface ModalProps<T> {
  open: boolean;
  text?: string;
  title: string;
  onClose: () => void;
  confirmBtnProps: LoadingBtnProps<T>;
  children?: React.ReactNode;
}

export function Modal<T>(props: ModalProps<T>) {
  const { t } = useTranslation();
  return (
    <BSModal show={props.open} onHide={props.onClose}>
      <BSModal.Header closeButton>
        <BSModal.Title>{props.title}</BSModal.Title>
      </BSModal.Header>
      <BSModal.Body>
        {props.children}
        {props.text && <p>{props.text}</p>}
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
