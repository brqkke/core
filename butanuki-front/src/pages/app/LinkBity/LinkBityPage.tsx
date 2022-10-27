import { LoggedLayout } from "../../../layout/LoggedLayout";
import { LinkBity } from "./LinkBity";

export function LinkBityPage() {
  return (
    <LoggedLayout>
      <div className="row">
        <div className="col-12">
          <LinkBity />
        </div>
      </div>
    </LoggedLayout>
  );
}
