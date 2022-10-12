import { Redirect, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useLinkBityMutation } from "../../generated/graphql";

export function LinkBity() {
  const location = useLocation();
  const [urlSearchParams] = useState(new URLSearchParams(location.search));
  const [linkBityWithCode, result] = useLinkBityMutation();
  useEffect(() => {
    const url = window.document.location.href;
    const path = url.replace(window.document.location.origin, "");
    linkBityWithCode({ variables: { redirectedFrom: path } });
  }, [linkBityWithCode, urlSearchParams]);

  if (result.loading || !result.called) {
    return <p>Loading</p>;
  }

  if (result.data?.linkBity.bityTokenStatus.linked) {
    return <Redirect to={"/"} />;
  }

  const urlError = urlSearchParams.get("error_description");
  const responseError = result.error?.message;
  const messages = [responseError, urlError].filter((err) => err);

  return (
    <p>
      {messages.join(" ") || "Error."}
      <br />
      <br />
      <br /> Try again : <a href={"/"}>Go back</a>
    </p>
  );
}
