import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import React from "react";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({ uri: "/api/graphql" });
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    if (
      graphQLErrors.some((error) => error.extensions.code === "UNAUTHENTICATED")
    ) {
      document.location.assign("/login");
    }
  }
});

const authLink = setContext((req, { headers }) => {
  const token = localStorage.getItem("sessionKey");
  return {
    headers: {
      ...headers,
      authorization: token || "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, authLink, httpLink]),
});

export function ApolloClientProvider(props: React.PropsWithChildren<{}>) {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
