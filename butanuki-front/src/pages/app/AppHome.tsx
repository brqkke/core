import { BityStatus } from "../../components/BityStatus";
import { LoggedLayout } from "../../layout/LoggedLayout";
import { useUserContext } from "../../context/UserContext";
import { Vaults } from "../../components/Vaults";
import { TokenStatus } from "../../generated/graphql";

export function AppHome() {
  const user = useUserContext();
  const bityStatus = user.bityTokenStatus;

  return (
    <LoggedLayout>
      <div className="row">
        <div className="col-md-12">
          <h3>Bity account</h3>
          <BityStatus bityStatus={bityStatus} />
          {bityStatus && bityStatus.linked && (
            // <OrderStatus
            //   disabled={bityStatus.linkStatus === TokenStatus.Broken}
            // />
            <Vaults disabled={bityStatus.linkStatus === TokenStatus.Broken} />
          )}
        </div>
      </div>
    </LoggedLayout>
  );
}
