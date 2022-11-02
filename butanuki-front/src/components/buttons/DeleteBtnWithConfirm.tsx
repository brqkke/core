import React, { useState } from "react";
import { DeleteLoadingBtn } from "./DeleteLoadingBtn";
import { ConfirmDeleteModal } from "../modals/ConfirmDeleteModal";

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
