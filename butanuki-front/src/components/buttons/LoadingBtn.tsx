export interface LoadingBtnProps<T> {
  onClick?: () => T | Promise<T>;
  level: "success" | "warning" | "primary" | "danger";
  size?: "sm" | "lg" | "md" | "xs";
  loading?: boolean;
  text: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function LoadingBtn<T>({
  size = "md",
  loading,
  text,
  onClick,
  level,
  disabled,
  type,
  className,
}: LoadingBtnProps<T>) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${size} btn-${level} ${className ? className : ""}`}
      disabled={loading || disabled}
      type={type}
    >
      {text}
      {loading && (
        <>
          {" "}
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}
