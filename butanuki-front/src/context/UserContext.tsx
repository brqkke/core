import { createContext, useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { get } from "../api/call";
import { useTranslation } from "react-i18next";

const UserContext = createContext<{ email: string }>({ email: "dummy" });

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ email: string } | null | undefined>(
    undefined
  );
  const [locale, setLocale] = useState("en");
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffect(() => {
    const sessionKey = window.localStorage.getItem("sessionKey");
    if (!sessionKey) {
      setUser(null);
      return;
    }

    (async () => {
      const response = await get<{ email: string; locale: string }>("/auth/me");
      if (response.error) {
        setUser(null);
        return;
      }

      if (response.response?.email) {
        setUser(response.response);
        setLocale(response.response.locale);
        return;
      }

      setUser(null);
    })();
  }, []);

  if (user === undefined) {
    return <p>Loading</p>;
  }

  if (user === null) {
    return <Redirect to={"/login"} />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext(UserContext);
}
