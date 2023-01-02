import { useLocation, useNavigate, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { post } from "../api/call";
import { LoadingCard } from "../components/LoadingCard";
import { MainLayout } from "../layout/MainLayout";
import { useEffectOnce } from "../utils/hooks";

const useVerifyEmail = ({
  token,
  email,
}: {
  token: string;
  email: string;
}): {
  loading: boolean;
  result?: { sessionToken: string; success: boolean };
} => {
  //avoid fetching twice in dev mode with strict mode
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    sessionToken: string;
    success: boolean;
  }>();

  useEffectOnce(() => {
    post<
      { tempCode: string; email: string },
      { sessionToken: string; success: boolean }
    >("/auth/login/email/verify", { tempCode: token, email }).then((r) => {
      setLoading(false);
      if (r.response && r.response.success) {
        setResult({ sessionToken: r.response.sessionToken, success: true });
      } else {
        setResult({ sessionToken: "", success: false });
      }
    });
  });

  return {
    loading,
    result,
  };
};

const LoginWithoutMfa = ({
  token,
  email,
}: {
  token: string;
  email: string;
}) => {
  const navigate = useNavigate();
  const { loading, result } = useVerifyEmail({
    token,
    email,
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    if (result?.success) {
      window.localStorage.setItem("sessionKey", result.sessionToken);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [loading, result, navigate]);

  return <LoadingCard />;
};

const LoginWithMfa = ({ token, email }: { token: string; email: string }) => {
  const [totp, setTotp] = useState("");
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const reset = () => {
    setTotp("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (totp.length === 6) {
      post<
        { tempCode: string; email: string; mfaCode: string },
        { sessionToken: string; success: boolean }
      >("/auth/login/email/verify", {
        tempCode: token,
        email,
        mfaCode: totp,
      }).then((r) => {
        if (r.response && r.response.success) {
          window.localStorage.setItem("sessionKey", r.response.sessionToken);
          navigate("/");
        } else {
          reset();
        }
        console.log(r);
      });
    }
  }, [navigate, totp, token, email]);

  return (
    <div className="row">
      <div className="col-4">
        <h1>Enter your 2FA code</h1>
        <input
          className="form-control"
          placeholder="XXXXXX"
          ref={inputRef}
          type="number"
          maxLength={6}
          value={totp}
          autoFocus={true}
          onChange={(e) => {
            setTotp(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export function LoginValidate() {
  const location = useLocation();
  const { token, email } = useParams();

  const promptMFACode =
    new URLSearchParams(document.location.search).get("promptMfa") === "true";

  if (!promptMFACode) {
    return (
      <MainLayout>
        <LoginWithoutMfa email={email || ""} token={token || ""} />
      </MainLayout>
    );
  } else {
    return (
      <MainLayout>
        <LoginWithMfa email={email || ""} token={token || ""} />
      </MainLayout>
    );
  }
}
