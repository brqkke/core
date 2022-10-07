import { Redirect, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { post } from "../../api/call";

export function LinkBity() {
  const [done, setDone] = useState<boolean>();
  const location = useLocation();
  const [urlSearchParams] = useState(new URLSearchParams(location.search));

  useEffect(() => {
    if (urlSearchParams.get("error")) {
      setDone(false);
      return;
    }
    const url = window.document.location.href;
    const path = url.replace(window.document.location.origin, "");
    (async () => {
      const r = await post<{ redirectedFrom: string }, { success: boolean }>(
        "/bity/link/code",
        { redirectedFrom: path }
      );
      console.log(r);
      if (r.response && r.response.success) {
        setDone(true);
      } else {
        setDone(false);
      }
    })();
  }, [urlSearchParams]);

  if (done) {
    return <Redirect to={"/"} />;
  }

  if (done === false) {
    return (
      <p>
        {urlSearchParams.get("error_description") || "Error."}
        <br /> Try again : <a href={"/"}>Go back</a>
      </p>
    );
  }

  return <p>Loading</p>;
}
