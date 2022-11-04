import { LoadingBtn } from "./LoadingBtn";
import React from "react";

export const DeleteLoadingBtn = ({
  onClick,
  loading,
  text,
  className,
}: {
  text?: string;
  className?: string;
  onClick: () => void | Promise<void>;
  loading?: boolean;
}) => (
  <LoadingBtn
    size={"xs"}
    level={"danger"}
    onClick={onClick}
    text={text || "X"}
    loading={loading}
    className={className}
  />
);
