import { useUserContext } from "../../../context/UserContext";
import { Vaults } from "./Vaults/Vaults";
import { TokenStatus } from "../../../generated/graphql";
import { LoggedLayout } from "../../../layout/LoggedLayout";

export function AppHome() {
  const user = useUserContext();
  const bityStatus = user.bityTokenStatus;

  return (
    <LoggedLayout showBityStatus>
      <div className="row">
        <div className="col-md-12">
          {bityStatus && bityStatus.linked && (
            <Vaults disabled={bityStatus.linkStatus === TokenStatus.Broken} />
          )}
        </div>
      </div>
    </LoggedLayout>
  );
}
