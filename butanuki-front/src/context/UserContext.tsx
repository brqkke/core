import { createContext, useContext, useEffect } from "react";
import { Redirect } from "react-router";
import { useTranslation } from "react-i18next";
import { useMeQuery, UserProfileFragment } from "../generated/graphql";

const UserContext = createContext<UserProfileFragment>(
  {} as UserProfileFragment
);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, loading } = useMeQuery();
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
    return <p>Loading</p>;
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
