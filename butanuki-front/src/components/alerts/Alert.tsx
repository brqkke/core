import React from "react";

export function Alert({
  message,
  level,
}: {
  message: string;
  level: "danger" | "warning" | "info" | "success";
}) {
  return <div className={`alert alert-${level}`}>{message}</div>;
}
