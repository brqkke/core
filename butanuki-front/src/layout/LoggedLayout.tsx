import { useUserContext } from "../context/UserContext";
import { MainLayout } from "./MainLayout";
import { LocaleChanger } from "../components/LocaleChanger";

export function LoggedLayout({ children }: { children: React.ReactNode }) {
  const user = useUserContext();

  return (
    <MainLayout>
      <div className="row">
        <div className="col-lg-12">
          <LocaleChanger logged />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <h2>
            Hello {user.email}{" "}
            <a className={"btn btn-warning btn-sm"} href={"/logout"}>
              Logout
            </a>
          </h2>
        </div>
      </div>
      {children}
    </MainLayout>
  );
}
