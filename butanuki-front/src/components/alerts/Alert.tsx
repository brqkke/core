import React from "react";

type level = "danger" | "warning" | "info" | "success";
type AlertProps =
  | {
      level: level;
      message: string;
    }
  | {
      level: level;
      children: React.ReactNode;
    };

export function Alert(props: AlertProps) {
  const content = "message" in props ? props.message : props.children;
  return <div className={`alert alert-${props.level}`}>{content}</div>;
}
