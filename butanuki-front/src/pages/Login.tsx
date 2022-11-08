import { usePublicPageLink } from "../utils/i18n";
import { MainLayout } from "../layout/MainLayout";
import { useEffectOnce } from "../utils/hooks";

export function Login() {
  const getUrl = usePublicPageLink();
  const link = getUrl("login");
  useEffectOnce(() => {
    window.location.href = link;
  });
  return (
    <MainLayout>
      <a href={link}>Login page</a>
    </MainLayout>
  );
}
