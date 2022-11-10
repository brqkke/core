import { useUserContext } from "../context/UserContext";
import { MainLayout } from "./MainLayout";
import { LocaleChanger } from "../components/LocaleChanger/LocaleChanger";
import { BityStatus } from "../components/BityStatus";
import { Link } from "react-router-dom";

function UserAndBityStatus({ withBityStatus }: { withBityStatus?: boolean }) {
  const user = useUserContext();

  return (
    <div className="row mb-4">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 d-flex justify-content-between align-items-center">
                <h3 className="card-title heading-bitcoin">
                  Hello {user.email}
                </h3>
                <Link className="btn btn-warning btn-sm" to={"/logout"}>
                  Logout
                </Link>
              </div>
            </div>
          </div>
          {withBityStatus && (
            <>
              <hr className={"mx-2 my-1"} />
              <div className="card-body">
                <h5 className="card-title">Bity Status</h5>
                <BityStatus bityStatus={user.bityTokenStatus} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function LoggedLayout({
  children,
  showBityStatus,
}: {
  children: React.ReactNode;
  showBityStatus?: boolean;
}) {
  return (
    <MainLayout>
      <div className="row">
        <div className="col-lg-12 mb-4">
          <LocaleChanger logged />
        </div>
      </div>
      <UserAndBityStatus withBityStatus={showBityStatus} />
      {children}
    </MainLayout>
  );
}
