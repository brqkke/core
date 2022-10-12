import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import React from "react";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({ uri: "/api/graphql" });

const authLink = setContext((_, { headers }) => {
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
  link: authLink.concat(httpLink),
});

export function ApolloClientProvider(props: React.PropsWithChildren<{}>) {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
