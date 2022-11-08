import { useNavigate, useParams } from "react-router";
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

export function LoginValidate() {
  const navigate = useNavigate();
  const { token, email } = useParams<{ token: string; email: string }>();
  const { loading, result } = useVerifyEmail({
    token: token || "",
    email: email || "",
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
  return (
    <MainLayout>
      <LoadingCard />
    </MainLayout>
  );
}
