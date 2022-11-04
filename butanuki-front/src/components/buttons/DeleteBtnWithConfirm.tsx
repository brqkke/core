import React, { useState } from "react";
import { DeleteLoadingBtn } from "./DeleteLoadingBtn";
import { ConfirmDeleteModal } from "../modals/ConfirmDeleteModal";
import { MutationResult } from "@apollo/client/react/types/types";

export const DeleteBtnWithConfirm = ({
  onDelete,
  mutationResult,
  label,
  className,
}: {
  label?: string;
  onDelete: () => unknown | Promise<unknown>;
  mutationResult: MutationResult<unknown>;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DeleteLoadingBtn
        text={label}
        onClick={() => setOpen(true)}
        className={className}
      />
      <ConfirmDeleteModal
        open={open}
        onClose={() => setOpen(false)}
        onDelete={onDelete}
        mutationResult={mutationResult}
      />
    </>
  );
};
