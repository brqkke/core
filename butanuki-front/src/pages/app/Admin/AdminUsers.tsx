import {
  Sort,
  UserRole,
  UserSortFields,
  useUsersQuery,
} from "../../../generated/graphql";
import { usePagination, useSorting } from "../../../utils/hooks";
import { Pagination } from "../../../components/pagination/Pagination";
import React, { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { isoToDDMMYYYYHHMMSS } from "../../../utils/date";

const BooleanFilter = ({
  falseText,
  trueText,
  unsetText,
  text,
  onChange,
}: {
  text: string;
  trueText: string;
  falseText: string;
  unsetText: string;
  onChange: (value?: boolean) => void;
}) => {
  return (
    <p>
      {text}:{" "}
      <select
        className="form-select"
        onChange={(e) => {
          onChange(e.target.value ? JSON.parse(e.target.value) : undefined);
        }}
      >
        <option value="">{unsetText}</option>
        <option value={"true"}>{trueText}</option>
        <option value={"false"}>{falseText}</option>
      </select>
    </p>
  );
};

export const AdminUsers = () => {
  const { gotoPage, paginationInput, reset, setPageSize } = usePagination();
  const { sortingInput, onToggle } = useSorting(
    UserSortFields,
    UserSortFields.Email,
    Sort.Asc,
    reset
  );
  const [filterActiveBity, setFilterActiveBity] = useState<boolean>();
  const [filterHasOpenOrders, setFilterHasOpenOrders] = useState<boolean>();
  const [search, setSearch] = useState("");
  const users = useUsersQuery({
    variables: {
      pagination: paginationInput,
      query: search,
      sort: sortingInput,
      filters: {
        hasActiveBityToken: filterActiveBity,
        hasOrders: filterHasOpenOrders,
      },
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
      <div className="row mb-3">
        <div className="col-md-4">
          <p>
            Email
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              onChange={debouncedSearch}
            />
          </p>
        </div>
        <div className="col-md-4">
          <BooleanFilter
            text="Active Bity Token"
            trueText="Yes"
            falseText="No"
            unsetText=""
            onChange={(value) => {
              setFilterActiveBity(value);
              reset();
            }}
          />
        </div>
        <div className="col-md-4">
          <BooleanFilter
            text="Has Open Orders"
            trueText="Yes"
            falseText="No"
            unsetText=""
            onChange={(value) => {
              setFilterHasOpenOrders(value);
              reset();
            }}
          />
        </div>
      </div>
      <table className="table table-responsive">
        <thead>
          <tr>
            <th scope="col">
              Email{" "}
              <button
                className={"btn btn-sm"}
                onClick={() => onToggle(UserSortFields.Email)}
              >
                /\ \/
              </button>
            </th>
            <th scope="col">
              Bity Status{" "}
              <button
                className={"btn btn-sm"}
                onClick={() => onToggle(UserSortFields.BityStatus)}
              >
                /\ \/
              </button>
            </th>
            <th scope="col">
              Has open orders{" "}
              <button
                className={"btn btn-sm"}
                onClick={() => onToggle(UserSortFields.HasOpenOrders)}
              >
                /\ \/
              </button>
            </th>
            <th scope="col">
              Created at{" "}
              <button
                className={"btn btn-sm"}
                onClick={() => onToggle(UserSortFields.CreatedAt)}
              >
                /\ \/
              </button>
            </th>
            <th scope="col">View</th>
          </tr>
        </thead>
        <tbody>
          {(users.data || users.previousData)?.users.items.map((user) => (
            <tr key={user.id}>
              <td>
                {user.email}
                {user.role === UserRole.Admin && (
                  <span className={"text-danger"}>*</span>
                )}
              </td>
              <td>{user.bityTokenStatus?.linkStatus}</td>
              <td>{user.hasOpenOrders ? "Yes" : "No"}</td>
              <td>{isoToDDMMYYYYHHMMSS(user.createdAt)}</td>
              <td>
                <Link
                  className={"btn btn-info btn-sm"}
                  to={`/admin/users/${user.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(users.data || users.previousData) && (
        <Pagination
          pageSize={paginationInput.count}
          setPageSize={setPageSize}
          paginationInfos={(users.data || users.previousData)!.users.pagination}
          onChange={gotoPage}
        />
      )}
    </div>
  );
};
