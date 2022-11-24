import { createContext, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMeQuery, UserProfileFragment } from "../generated/graphql";
import { Navigate } from "react-router";
import { Alert } from "../components/alerts/Alert";
import { MainLayout } from "../layout/MainLayout";
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
      <Outlet />
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
