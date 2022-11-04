import { BityStatus } from "../../../components/BityStatus";
import { LoggedLayout } from "../../../layout/LoggedLayout";
import { useUserContext } from "../../../context/UserContext";
import { Vaults } from "./Vaults/Vaults";
import { TokenStatus } from "../../../generated/graphql";

export function AppHome() {
  const user = useUserContext();
  const bityStatus = user.bityTokenStatus;

  return (
    <LoggedLayout>
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Bity account</h3>
            </div>
            <div className="card-body">
              <BityStatus bityStatus={bityStatus} />
            </div>
          </div>
          {bityStatus && bityStatus.linked && (
            <Vaults disabled={bityStatus.linkStatus === TokenStatus.Broken} />
          )}
        </div>
      </div>
    </LoggedLayout>
  );
}
