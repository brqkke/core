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
    const pages = new Set<number>();
    // show first page
    // show last page
    // show current page and 1 page before and after
    //show middle page (handles odds and evens)
    for (let i = 0; i <= paginationInfos.lastPage; i++) {
      if (i < 1 || i > paginationInfos.lastPage - 1) {
        pages.add(i);
      }
      if (i >= paginationInfos.page - 1 && i <= paginationInfos.page + 1) {
        pages.add(i);
      }
      if (
        (paginationInfos.lastPage % 2 === 0 && // even
          i === paginationInfos.lastPage / 2) ||
        (paginationInfos.lastPage % 2 === 1 && // odd
          i === (paginationInfos.lastPage - 1) / 2)
      ) {
        pages.add(i);
      }
    }

    return Array.from(pages);
  }, [paginationInfos.page, paginationInfos.lastPage]);

  return (
    <div>
      <p>
        Page {paginationInfos.page + 1} of {paginationInfos.lastPage + 1}, total{" "}
        {paginationInfos.count} items
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
          {displayedPages.map((page, i, array) => {
            const addEllipsis = i > 0 && array[i - 1] !== page - 1;
            return (
              <React.Fragment key={page}>
                {addEllipsis && (
                  <li className="page-item">
                    <a className={`page-link disabled`} href="#">
                      ...
                    </a>
                  </li>
                )}
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
              </React.Fragment>
            );
          })}
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
