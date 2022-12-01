import React, { useEffect } from "react";
import { useConfigContext } from "../context/ConfigContext";

const win = window as Window;

// if we visit api.butanuki.com/xxx, we get redirected to app.butanuki.com/xxx
export const RedirectOnWrongDomain = (props: React.PropsWithChildren<{}>) => {
  const { baseUrl } = useConfigContext();
  useEffect(() => {
    if (baseUrl && !win.location.href.startsWith(baseUrl)) {
      win.location.assign(
        win.location.href.replace(win.location.origin, baseUrl)
      );
    }
  }, [baseUrl]);

  if (!baseUrl) {
    return null;
  }
  if (win.location.href.startsWith(baseUrl)) {
    return <>{props.children}</>;
  }
  return null;
};
