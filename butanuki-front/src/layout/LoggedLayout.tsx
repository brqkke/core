import { useUserContext } from "../context/UserContext";
import { MainLayout } from "./MainLayout";
import { LocaleChanger } from "../components/LocaleChanger/LocaleChanger";
import { Link } from "react-router-dom";

export function LoggedLayout({ children }: { children: React.ReactNode }) {
  const user = useUserContext();
  return (
    <MainLayout>
      <div className="row">
        <div className="col-lg-12 mb-4">
          <LocaleChanger logged />
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-12">
              <h2 className={"heading-bitcoin"}>
                Hello {user.email}{" "}
                <Link to={"/logout"} className={"btn btn-warning btn-sm"}>
                  Logout
                </Link>
              </h2>
            </div>
          </div>
        </div>
      </div>
      {children}
    </MainLayout>
  );
}
