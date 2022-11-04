import { Header } from "../components/static/Header";
import { Footer } from "../components/static/Footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
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
