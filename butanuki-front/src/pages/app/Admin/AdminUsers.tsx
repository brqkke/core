import { UserSortFields, useUsersQuery } from "../../../generated/graphql";
import { usePagination, useSorting } from "../../../utils/hooks";
import { Pagination } from "../../../components/pagination/Pagination";
import React, { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";

export const AdminUsers = () => {
  const { gotoPage, paginationInput, reset } = usePagination();
  const { sortingInput, onToggle } = useSorting(
    UserSortFields,
    UserSortFields.Email
  );
  const [search, setSearch] = useState("");
  const users = useUsersQuery({
    variables: {
      pagination: paginationInput,
      query: search,
      sort: sortingInput,
    },
  });

  const handleSearchChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(ev.target.value);
      reset();
    },
    [reset]
  );

  const debouncedSearch = useMemo(() => {
    return debounce(handleSearchChange, 500);
  }, [handleSearchChange]);

  return (
    <div>
      <h4>Users</h4>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          onChange={debouncedSearch}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
              Email{" "}
              <button onClick={() => onToggle(UserSortFields.Email)}>
                /\ \/
              </button>
            </th>
            <th scope="col">Role</th>
            <th scope="col">
              Bity Status{" "}
              <button onClick={() => onToggle(UserSortFields.BityStatus)}>
                /\ \/
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {(users.data || users.previousData)?.users.items.map((user) => (
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
          onChange={gotoPage}
        />
      )}
    </div>
  );
};
