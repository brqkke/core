import { useParams } from "react-router";
import {
  OrderSortFields,
  Sort,
  useOrdersQuery,
  useUserQuery,
} from "../../../generated/graphql";
import { usePagination, useSorting } from "../../../utils/hooks";
import { Pagination } from "../../../components/pagination/Pagination";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { formatAmount } from "../../../utils/i18n";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { isoToDDMMYYYYHHMMSS } from "../../../utils/date";

export const AdminUser = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="row">
      <div className="col-12">
        <UserDetails userId={id!} />
      </div>
      <div className="col-12">
        <OrderHistory userId={id!} />
      </div>
    </div>
  );
};

const UserDetails = ({ userId }: { userId: string }) => {
  const { data } = useUserQuery({
    variables: {
      id: userId,
    },
  });

  return data?.user ? (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{data.user.email}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{data.user.id}</h6>
        <p className="card-text">
          <br />
          Bity Status: {data.user.bityTokenStatus.linkStatus}
          <br />
          Has open orders: {data.user.hasOpenOrders ? "Yes" : "No"}
          <br />
          Custom partner fee: {data.user.customPartnerFee ?? "None"}
          <br />
          Created at: {isoToDDMMYYYYHHMMSS(data.user.createdAt)}
        </p>
      </div>
    </div>
  ) : null;
};

const OrderHistory = ({ userId }: { userId: string }) => {
  const { i18n } = useTranslation();
  const { paginationInput, reset, gotoPage, setPageSize } = usePagination();
  const { onToggle, sortingInput } = useSorting(
    OrderSortFields,
    OrderSortFields.CreatedAt,
    Sort.Desc,
    reset
  );
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
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

  const { data, previousData } = useOrdersQuery({
    variables: {
      userId,
      pagination: paginationInput,
      sort: sortingInput,
      reference: search,
    },
  });

  const onSelectRow = useCallback(
    (refBity: string) => {
      setSearch(refBity);
      reset();
      if (inputRef.current) {
        inputRef.current.value = refBity;
      }
    },
    [reset]
  );
  const displayedData = data || previousData;

  return (
    <div className="row">
      <div className="col-12">
        <h2>Orders History</h2>
      </div>
      <div className="col-md-4">
        <p>
          Ref bity
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder="Search"
            onChange={debouncedSearch}
          />
        </p>
      </div>
      {displayedData && (
        <div className="col-12">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Ref Bity</th>
                <th scope="col">ID bity</th>
                <th scope="col">Fiat amount</th>
                <th scope="col">Status</th>
                <th scope="col">
                  Created at
                  <button
                    className={"btn btn-sm"}
                    onClick={() => onToggle(OrderSortFields.CreatedAt)}
                  >
                    /\ \/
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedData.orders.items.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.transferLabel}
                    <button
                      className={"btn btn-sm"}
                      onClick={() => onSelectRow(order.transferLabel)}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </td>
                  <td>
                    <a
                      href={`https://bity.com/exchange/#/order/${order.remoteId}`}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      {order.remoteId}
                    </a>
                  </td>
                  <td>
                    {formatAmount(
                      order.amount,
                      order.currency,
                      i18n.language as "fr" | "en"
                    )}
                  </td>
                  <td>
                    {order.status}
                    {order.filledAmount ? (
                      <span>
                        {" "}
                        -{" "}
                        {formatAmount(
                          order.filledAmount,
                          "btc",
                          i18n.language as "fr" | "en"
                        )}
                      </span>
                    ) : null}
                  </td>
                  <td>{isoToDDMMYYYYHHMMSS(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            paginationInfos={displayedData.orders.pagination}
            setPageSize={setPageSize}
            pageSize={paginationInput.count}
            onChange={gotoPage}
          />
        </div>
      )}
    </div>
  );
};
