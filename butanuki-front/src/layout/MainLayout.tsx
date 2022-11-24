import { Header } from "../components/static/Header";
import { Footer } from "../components/static/Footer";
import React from "react";
import { LocaleChanger } from "../components/LocaleChanger/LocaleChanger";

export const MainLayout = React.memo(
  ({
    children,
    logged,
    withoutLocaleChanger,
  }: {
    children: React.ReactNode;
    logged?: boolean;
    withoutLocaleChanger?: boolean;
  }) => {
    return (
      <>
        <Header />
        <div className={"container"} style={{ marginTop: "60px" }}>
          <div className="row">
            <div className="col-lg-12 mb-4">
              {!withoutLocaleChanger && <LocaleChanger logged={logged} />}
            </div>
          </div>
          {children}
        </div>
        <Footer />
      </>
    );
  }
);
