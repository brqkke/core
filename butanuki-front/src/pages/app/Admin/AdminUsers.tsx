import { useUsersQuery } from "../../../generated/graphql";
import { usePagination } from "../../../utils/hooks";
import { Pagination } from "../../../components/pagination/Pagination";

export const AdminUsers = () => {
  const pagination = usePagination();
  const users = useUsersQuery({
    variables: {
      pagination: pagination.paginationInput,
    },
  });

  return (
    <div>
      <h4>Users</h4>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Bity Status</th>
          </tr>
        </thead>
        <tbody>
          {users.data?.users.items.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.bityTokenStatus?.linkStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(users.data || users.previousData) && (
        <Pagination
          paginationInfos={(users.data || users.previousData)!.users.pagination}
          onChange={pagination.gotoPage}
        />
      )}
    </div>
  );
};
