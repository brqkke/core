import { Header } from "../components/static/Header";
import { Footer } from "../components/static/Footer";
import React from "react";

export const MainLayout = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        <Header />
        <div className={"container"} style={{ marginTop: "60px" }}>
          {children}
        </div>
        <Footer />
      </>
    );
  }
);
