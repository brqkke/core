import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import { LoginValidate } from "./pages/LoginValidate";
import { AppHome } from "./pages/app/Home/AppHome";
import { OrderSettings } from "./pages/app/OrderSettings/OrderSettings";
import React, { Suspense } from "react";
import { LinkBityPage } from "./pages/app/LinkBity/LinkBityPage";
import { Alert } from "./components/alerts/Alert";
import { Login } from "./pages/Login";
import { VaultSettings } from "./pages/app/VaultSettings/VaultSettings";
import { useEffectOnce } from "./utils/hooks";
import { useNavigate } from "react-router";
import { EstimatorPage } from "./pages/app/Estimator/EstimatorPage";
import { LoadingCard } from "./components/LoadingCard";
import { MfaSettingsPage } from "./pages/app/Settings/MfaSettingsPage";

const AdminApp = React.lazy(() => import("./pages/app/Admin/AdminApp"));

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/savings" element={<EstimatorPage />} />
        <Route path={"/logout"} element={<Logout />} />
        <Route
          path={"/login/verify/:token/:email"}
          element={<LoginValidate />}
        />
        <Route path={"login"} element={<Login />} />
        <Route path={"*"} element={<UserApp />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserApp() {
  return (
    <Routes>
      <Route element={<UserContextProvider />}>
        <Route path={"/"} element={<AppHome />} />
        <Route path={"/settings/mfa"} element={<MfaSettingsPage />} />
        <Route path={"/vault/:vaultId/new-order"} element={<OrderSettings />} />
        <Route path={"/vault/:vaultId/edit"} element={<VaultSettings />} />
        <Route
          path={"/vault/:vaultId/edit-order/:orderId"}
          element={<OrderSettings />}
        />
        <Route path={"/auth/bity/callback"} element={<LinkBityPage />} />
        <Route
          path={"/admin/*"}
          element={
            <Suspense fallback={<LoadingCard />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path={"*"} element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  return <Alert message={"Not found"} level={"danger"} />;
}

function Logout() {
  const navigate = useNavigate();
  useEffectOnce(() => {
    window.localStorage.removeItem("sessionKey");
    navigate("/login");
  });

  return null;
}
