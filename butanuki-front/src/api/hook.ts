import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, call } from "./call";

export const useGet = <R>(
  path: string,
  skip: boolean = false
): {
  response?: R;
  error?: ApiError;
  refetch: () => void;
} => useCall<undefined, R>("GET", path, undefined, skip);

export function useCall<T, R>(
  method: string,
  path: string,
  req?: T,
  skip: boolean = false
): {
  loading: boolean;
  response?: R;
  error?: ApiError;
  refetch: () => void;
} {
  const reqRef = useRef(Math.random());
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<{
    response?: R;
    error?: ApiError;
  }>({});

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      reqRef.current = Math.random();
      const refStart = reqRef.current;
      const r = await call<T, R>(method, path, req);
      if (refStart === reqRef.current) {
        setResponse(r);
      } else {
        return;
      }
    } catch (e: unknown) {
      setResponse({
        error: {
          status: "ERR",
          error: `${e}`,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [reqRef, method, path, req]);

  useEffect(() => {
    if (!skip) {
      fetch();
    }
  }, [fetch, skip]);

  return { loading, ...response, refetch: fetch };
}
