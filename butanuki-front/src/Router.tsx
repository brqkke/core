import { Switch, Route, BrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import { UserContextProvider } from "./context/UserContext";
import { LoginValidate } from "./pages/LoginValidate";
import { AppHome } from "./pages/app/AppHome";
import { LinkBity } from "./pages/app/LinkBity";
import { OrderSettings } from "./pages/app/OrderSettings";
import { useEffect } from "react";

export function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/login"} exact component={Login} />
        <Route path={"/logout"} exact component={Logout} />
        <Route
          path={"/login/verify/:token/:email"}
          exact
          component={LoginValidate}
        />
        <Route path={"*"} component={AppRouter} />
      </Switch>
    </BrowserRouter>
  );
}

function AppRouter() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Switch>
          <Route path={"/"} exact component={AppHome} />
          <Route path={"/order-settings"} exact component={OrderSettings} />
          <Route path={"/auth/bity/callback"} exact component={LinkBity} />
          <Route path={"*"} exact component={NotFound} />
        </Switch>
      </BrowserRouter>
    </UserContextProvider>
  );
}

function NotFound() {
  return <h1>Not found</h1>;
}

function Logout() {
  console.log("Logout");
  useEffect(() => {
    window.localStorage.removeItem("sessionKey");
    window.location.href = "/";
  }, []);

  return null;
}