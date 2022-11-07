import { useEffect, useRef } from "react";
import { usePublicPageLink } from "../utils/i18n";
import { MainLayout } from "../layout/MainLayout";

export function Login() {
  const getUrl = usePublicPageLink();
  const link = getUrl("login");
  const going = useRef(false);
  useEffect(() => {
    if (!going.current) {
      going.current = true;
      window.location.href = link;
    }
  }, [link]);
  return (
    <MainLayout>
      <a href={link}>Login page</a>
    </MainLayout>
  );
}
