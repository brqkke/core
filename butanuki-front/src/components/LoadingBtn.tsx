export function LoadingBtn<T>(props: {
  onClick: () => Promise<T>;
  level: "success" | "warning" | "primary" | "danger";
  loading?: boolean;
  text: string;
}) {
  return (
    <button
      onClick={props.onClick}
      className={`btn btn-${props.level}`}
      disabled={props.loading}
    >
      {props.loading && (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />{" "}
        </>
      )}
      {props.text}
    </button>
  );
}
