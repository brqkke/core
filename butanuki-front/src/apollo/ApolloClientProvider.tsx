import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import React, { useMemo } from "react";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useNavigate } from "react-router";

const httpLink = createHttpLink({ uri: "/api/graphql" });

const authLink = setContext((req, { headers }) => {
  const token = localStorage.getItem("sessionKey");
  return {
    headers: {
      ...headers,
      authorization: token || "",
    },
  };
});

export function ApolloClientProvider(props: React.PropsWithChildren<{}>) {
  const navigate = useNavigate();
  const errorLink = useMemo(
    () =>
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          if (
            graphQLErrors.some(
              (error) => error.extensions.code === "UNAUTHENTICATED"
            )
          ) {
            navigate("/login");
          }
        }
      }),
    [navigate]
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([errorLink, authLink, httpLink]),
      }),
    [errorLink]
  );

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
