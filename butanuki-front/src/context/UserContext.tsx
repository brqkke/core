import { createContext, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMeQuery, UserProfileFragment } from "../generated/graphql";
import { Navigate } from "react-router";
import { Alert } from "../components/alerts/Alert";
import { MainLayout } from "../layout/MainLayout";
import { LoggedLayout } from "../layout/LoggedLayout";
import { LoadingCard } from "../components/LoadingCard";
import { Outlet } from "react-router-dom";

const UserContext = createContext<UserProfileFragment>(
  {} as UserProfileFragment
);

export function UserContextProvider() {
  const { data, loading, error } = useMeQuery();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (data?.me) {
      i18n.changeLanguage(data.me.locale);
    }
  }, [i18n, data]);

  // useEffect(() => {
  //   const sessionKey = window.localStorage.getItem("sessionKey");
  //   if (!sessionKey) {
  //     setUser(null);
  //     return;
  //   }
  //
  //   (async () => {
  //     const response = await get<{ email: string; locale: string }>("/auth/me");
  //     if (response.error) {
  //       setUser(null);
  //       return;
  //     }
  //
  //     if (response.response?.email) {
  //       setUser(response.response);
  //       setLocale(response.response.locale);
  //       return;
  //     }
  //
  //     setUser(null);
  //   })();
  // }, []);

  if (loading) {
    return (
      <MainLayout>
        <LoadingCard />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert message={error.message} level={"danger"} />
      </MainLayout>
    );
  }

  if (!data?.me) {
    return <Navigate to={"/login"} />;
  }

  return (
    <UserContext.Provider value={data.me}>
      <LoggedLayout>
        <Outlet />
      </LoggedLayout>
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
