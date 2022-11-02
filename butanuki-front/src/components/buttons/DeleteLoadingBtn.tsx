import { LoadingBtn } from "./LoadingBtn";
import React from "react";

export const DeleteLoadingBtn = ({
  onClick,
  loading,
}: {
  onClick: () => void | Promise<void>;
  loading?: boolean;
}) => (
  <LoadingBtn
    size={"xs"}
    level={"danger"}
    onClick={onClick}
    text={"X"}
    loading={loading}
  />
);
