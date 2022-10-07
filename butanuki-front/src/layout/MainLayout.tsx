import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className={"container"}>
        <div className="row">
          <div className="col-lg-12">
            <h1>Butanuki</h1>
          </div>
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
}
