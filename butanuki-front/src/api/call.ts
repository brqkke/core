const baseUrl = "/api";
export const CLIENT_VERSION_HEADER = "X-Client-Version";

export interface ApiError {
  status: string;
  error:
    | string
    | { code: string; message: string }
    | { code: string; message: string }[];
}

export const call = async <T, R>(
  method: string,
  path: string,
  req?: T,
  noCredentials?: boolean,
  options?: RequestInit
): Promise<{
  response?: R;
  error?: ApiError;
}> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    [CLIENT_VERSION_HEADER]: import.meta.env.REACT_APP_BUILD_TAG || "",
  };
  if (!noCredentials) {
    const sessionKey = window.localStorage.getItem("sessionKey");
    if (sessionKey) {
      headers["Authorization"] = sessionKey;
    }
  }

  return await fetch(baseUrl + path, {
    method: method,
    headers,
    body: req && JSON.stringify(req),
    ...options,
  }).then((res) => {
    if (!res.ok) {
      return res
        .text()
        .then((text) => {
          if (!text) {
            return {};
          }
          try {
            return JSON.parse(text);
          } catch (e) {
            return {};
          }
        })
        .then(
          (
            resJ: ApiError & {
              message?:
                | string
                | { code: string; message: string }
                | { code: string; message: string }[];
            }
          ) => {
            return {
              error: {
                status: res.status + "",
                error: resJ.message ? resJ.message : resJ.error,
              },
            };
          }
        );
    }
    return res
      .text()
      .then((text) => (text ? JSON.parse(text) : {}))
      .then((resJ: R) => {
        return { response: resJ };
      });
  });
};

export const get = async <R>(
  path: string,
  noCredentials?: boolean,
  options?: RequestInit
): Promise<{
  response?: R;
  error?: ApiError;
}> => await call<undefined, R>("GET", path, undefined, noCredentials, options);

export const post = async <T, R>(
  path: string,
  req?: T
): Promise<{
  response?: R;
  error?: ApiError;
}> => await call<T, R>("POST", path, req);

export const put = async <T, R>(
  path: string,
  req: T
): Promise<{
  response?: R;
  error?: ApiError;
}> => await call<T, R>("PUT", path, req);

export const deleteCall = async <R>(
  path: string
): Promise<{
  response?: R;
  error?: ApiError;
}> => await call<undefined, R>("DELETE", path);
