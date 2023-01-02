import { Link, Route, Routes } from "react-router-dom";
import { AdminPage } from "./AdminPage";
import { LoggedLayout } from "../../../layout/LoggedLayout";
import { AdminUsers } from "./AdminUsers";

export default function AdminApp() {
  return (
    <LoggedLayout>
      <ul>
        <li>
          <Link to="/admin/users">Users list</Link>
        </li>
      </ul>
      <Routes>
        <Route path={"/"} element={<AdminPage />} />
        <Route path={"/users"} element={<AdminUsers />} />
      </Routes>
    </LoggedLayout>
  );
}
