import React from "react";

export const Layout = (
  props: React.PropsWithChildren<{ subtitle: string }>
) => {
  return (
    <html>
      <body>
        <h1 style={{ textAlign: "center" }}>Butanuki</h1>
        <h2>{props.subtitle}</h2>
        {props.children}
      </body>
    </html>
  );
};
