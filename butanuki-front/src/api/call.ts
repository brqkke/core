const baseUrl = process.env.REACT_APP_BASE_URL || "/api";
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
  req?: T
): Promise<{
  response?: R;
  error?: ApiError;
}> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    [CLIENT_VERSION_HEADER]: process.env.REACT_APP_BUILD_TAG || "",
  };
  const sessionKey = window.localStorage.getItem("sessionKey");
  if (sessionKey) {
    headers["Authorization"] = sessionKey;
  }

  return await fetch(baseUrl + path, {
    method: method,
    headers,
    body: req && JSON.stringify(req),
  }).then((res) => {
    if (!res.ok) {
      console.log(res.ok);
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
            console.log({
              status: res.status + "",
              error: resJ.error,
            });
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
  path: string
): Promise<{
  response?: R;
  error?: ApiError;
}> => await call<undefined, R>("GET", path, undefined);

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
