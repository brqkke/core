import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

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
