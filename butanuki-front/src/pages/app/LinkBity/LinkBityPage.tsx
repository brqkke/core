import { LinkBity } from "./LinkBity";
import { LoggedLayout } from "../../../layout/LoggedLayout";

export function LinkBityPage() {
  return (
    <LoggedLayout>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <LinkBity />
            </div>
          </div>
        </div>
      </div>
    </LoggedLayout>
  );
}
