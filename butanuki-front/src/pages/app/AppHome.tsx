import {BityStatus} from "../../components/BityStatus";
import {OrderStatus} from "../../components/OrderStatus";
import {LoggedLayout} from "../../layout/LoggedLayout";
import {useGet} from "../../api/hook";

const BITY_STATUS_ENDPOINT = "/bity/link/status";

export function AppHome() {
  const { response: bityStatus, refetch } =
    useGet<{ linked: boolean; linkStatus: "ACTIVE" | "BROKEN" }>(
      BITY_STATUS_ENDPOINT
    );

  return (
    <LoggedLayout>
      <div className="row">
        <div className="col-md-6">
          <h3>Bity account</h3>
          <BityStatus bityStatus={bityStatus} onDelete={refetch} />
          {bityStatus && bityStatus.linked && (
            <OrderStatus disabled={bityStatus.linkStatus === "BROKEN"} />
          )}
        </div>
      </div>
    </LoggedLayout>
  );
}
