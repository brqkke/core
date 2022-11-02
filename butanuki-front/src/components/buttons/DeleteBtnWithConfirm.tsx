import React, { useState } from "react";
import { DeleteLoadingBtn } from "./DeleteLoadingBtn";
import { ConfirmDeleteModal } from "../modals/ConfirmDeleteModal";
import { MutationResult } from "@apollo/client/react/types/types";

export const DeleteBtnWithConfirm = ({
  onDelete,
  mutationResult,
}: {
  onDelete: () => unknown | Promise<unknown>;
  mutationResult: MutationResult<unknown>;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DeleteLoadingBtn onClick={() => setOpen(true)} />
      <ConfirmDeleteModal
        open={open}
        onClose={() => setOpen(false)}
        onDelete={onDelete}
        mutationResult={mutationResult}
      />
    </>
  );
};
