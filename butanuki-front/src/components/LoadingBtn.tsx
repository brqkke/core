export function LoadingBtn<T>({
  size = "md",
  loading,
  text,
  onClick,
  level,
  disabled,
  type,
}: {
  onClick?: () => T | Promise<T>;
  level: "success" | "warning" | "primary" | "danger";
  size?: "sm" | "lg" | "md" | "xs";
  loading?: boolean;
  text: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${size} btn-${level}`}
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
