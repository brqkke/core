import { useTranslation } from "react-i18next";
import React from "react";

const English = React.lazy(() => import("./en"));
const French = React.lazy(() => import("./fr"));

const Placeholder = () => (
  <h3>
    Qu'est-ce que le Dollar Cost Averaging (DCA) et comment cela fonctionne-t-il
    ?
  </h3>
);

export default function BigText() {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const Component = React.useMemo(() => {
    switch (language) {
      case "fr":
        return French;
      default:
        return English;
    }
  }, [language]);

  return (
    <React.Suspense fallback={<Placeholder />}>
      <Component />
    </React.Suspense>
  );
}
