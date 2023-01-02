import { LoggedLayout } from "../../../layout/LoggedLayout";
import { useUserContext } from "../../../context/UserContext";
import {
  useDisableMfaMutation,
  useEnableMfaMutation,
  useSetupMfaMutation,
} from "../../../generated/graphql";
import { Suspense, useState } from "react";
import { LazyQRCodeDisplay } from "../../../components/QRCode/LazyQRCodeDisplay";

export const MfaSettingsPage = () => {
  const user = useUserContext();
  const [disable] = useDisableMfaMutation();
  return (
    <LoggedLayout>
      <h2>MFA Settings</h2>
      <div className="row">
        <div className="col-md-6">
          {user.mfaEnabled ? <MfaDisable /> : <MfaSetup />}
        </div>
      </div>
    </LoggedLayout>
  );
};

const MfaSetup = () => {
  const [setup, setupResult] = useSetupMfaMutation();
  const [code, setCode] = useState("");
  const [enable, enableResult] = useEnableMfaMutation({
    variables: {
      code,
    },
  });

  return (
    <div>
      {setupResult.data ? (
        <div className="row">
          <p>
            Scan the QR code with your MFA app and enter the code to enable MFA.
          </p>
          <div className="col-12">
            <Suspense fallback={<div>Loading...</div>}>
              <LazyQRCodeDisplay url={setupResult.data.setupMfa} />
            </Suspense>
          </div>
          <div className="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Enter the MFA code"
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                enable();
              }}
            >
              Enable MFA
            </button>
          </div>
        </div>
      ) : (
        <p>
          You don't have MFA enabled. You can enable it by clicking the button
          below.
          <br />
          <button className="btn btn-primary" onClick={() => setup()}>
            Enable MFA
          </button>
        </p>
      )}
    </div>
  );
};

const MfaDisable = () => {
  const [code, setCode] = useState("");
  const [disable, disableResult] = useDisableMfaMutation({
    variables: { code },
  });
  return (
    <div>
      <p>
        You have MFA enabled. You can disable it by entering the code and
        clicking the button below.
      </p>
      <input
        type="number"
        className="form-control"
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
        placeholder="Enter the MFA code"
      />
      <button
        className="btn btn-danger"
        onClick={() => {
          disable();
        }}
      >
        Disable MFA
      </button>
    </div>
  );
};
