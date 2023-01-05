import React, { useCallback, useMemo } from "react";
import { PaginationInfosFragment } from "../../generated/graphql";

export const Pagination = ({
  paginationInfos,
  onChange,
}: {
  paginationInfos: PaginationInfosFragment;
  onChange: (page: number) => void;
}) => {
  const prev: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      onChange(paginationInfos.previousPage);
    },
    [paginationInfos.previousPage, onChange]
  );

  const next: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      onChange(paginationInfos.nextPage);
    },
    [onChange, paginationInfos.nextPage]
  );

  const gotoFirst: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      onChange(0);
    },
    [onChange]
  );

  const gotoLast: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      onChange(paginationInfos.lastPage);
    },
    [onChange, paginationInfos.lastPage]
  );

  const displayedPages = useMemo(() => {
    const pages = [];
    for (let i = paginationInfos.page - 1; i <= paginationInfos.page + 1; i++) {
      if (i >= 0 && i <= paginationInfos.lastPage) {
        pages.push(i);
      }
    }
    return pages;
  }, [paginationInfos.page, paginationInfos.lastPage]);

  return (
    <div>
      <p>
        Page {paginationInfos.page + 1} of {paginationInfos.lastPage + 1}
      </p>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <a
              className={`page-link ${
                paginationInfos.firstPage === paginationInfos.page
                  ? "disabled"
                  : ""
              }`}
              href="#"
              onClick={gotoFirst}
            >
              First
            </a>
          </li>
          <li
            className={`page-item ${
              paginationInfos.previousPage === paginationInfos.page
                ? "disabled"
                : ""
            }`}
          >
            <a className="page-link" href="#" onClick={prev}>
              Previous
            </a>
          </li>
          {displayedPages.map((page) => (
            <li className="page-item" key={page}>
              <a
                className={`page-link ${
                  page === paginationInfos.page ? "active" : ""
                }`}
                href="#"
                onClick={() => onChange(page)}
              >
                {page + 1}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a
              className={`page-link ${
                paginationInfos.nextPage === paginationInfos.page
                  ? "disabled"
                  : ""
              }`}
              href="#"
              onClick={next}
            >
              Next
            </a>
          </li>
          <li className="page-item">
            <a
              className={`page-link ${
                paginationInfos.lastPage === paginationInfos.page
                  ? "disabled"
                  : ""
              }`}
              href="#"
              onClick={gotoLast}
            >
              Last
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
