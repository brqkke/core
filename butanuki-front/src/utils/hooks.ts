import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PaginationInput, Sort } from "../generated/graphql";

export const useEffectOnce = (effect: React.EffectCallback) => {
  const effectRef = React.useRef(effect);
  effectRef.current = effect;
  useEffect(() => {
    const timeout = setTimeout(effectRef.current, 100);
    return () => clearTimeout(timeout);
  }, []);
};

// useDebounce is a hook that returns a debounced version of the value passed to it.
// It skips the delay if the value is equals to the specified skipIfValueIs
//This is used to avoid blinking spinner when the loading is too fast
export const useDebounce = <T>(value: T, delay: number, skipIfValueIs?: T) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(
      () => {
        setDebouncedValue(value);
      },
      value === skipIfValueIs ? 0 : delay
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, skipIfValueIs]);
  return debouncedValue;
};

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title.replaceAll("<nb>", "").replaceAll("</nb>", "");
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export const usePagination = (): {
  paginationInput: PaginationInput;
  gotoPage: (page: number) => void;
  reset: () => void;
} => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const paginationInput: PaginationInput = useMemo(() => {
    return {
      count: pageSize,
      page: currentPage,
    };
  }, [currentPage, pageSize]);

  const reset = useCallback(() => {
    setCurrentPage(0);
    setPageSize(10);
  }, []);

  return useMemo(
    () => ({
      gotoPage: setCurrentPage,
      paginationInput,
      reset,
    }),
    [paginationInput, reset]
  );
};

export const useSorting = <E extends object>(
  Enum: E,
  defaultSortBy: E[keyof E],
  defaultOrder: Sort = Sort.Asc
) => {
  type SortBy = E[keyof E];
  const [sortBy, setSortBy] = useState<E[keyof E]>(defaultSortBy);
  const [order, setOrder] = useState<Sort>(defaultOrder);

  const sortingInput: { order: Sort; sortBy: E[keyof E] } = useMemo(() => {
    return { order, sortBy };
  }, [sortBy, order]);

  const onToggle = useCallback(
    (by: SortBy) => {
      if (sortBy === by) {
        setOrder((o) => (o === Sort.Asc ? Sort.Desc : Sort.Asc));
      } else {
        setSortBy(by);
        setOrder(Sort.Asc);
      }
    },
    [sortBy]
  );

  return useMemo(
    () => ({
      sortingInput,
      onToggle,
    }),
    [sortingInput, onToggle]
  );
};
