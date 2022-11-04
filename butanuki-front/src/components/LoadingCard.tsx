import React from "react";

export const LoadingCard = React.memo(() => {
  return (
    <div className="card">
      <div className="card-body text-center py-5">
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
      </div>
    </div>
  );
});
