import { createContext, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMeQuery, UserProfileFragment } from "../generated/graphql";
import { Redirect } from "react-router";
import { Alert } from "../components/Alert";

const UserContext = createContext<UserProfileFragment>(
  {} as UserProfileFragment
);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, loading, error } = useMeQuery();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (data?.me) {
      console.log("effect usercontext", "i18n.changeLanguage", data.me.locale);
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
    return <p>Loading</p>;
  }

  if (error) {
    return <Alert message={error.message} level={"danger"} />;
  }

  if (!data?.me) {
    return <Redirect to={"/login"} />;
  }

  return (
    <UserContext.Provider value={data.me}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
