import React from "react";
import { ConfigContextProvider } from "./context/ConfigContext";
import { RedirectOnWrongDomain } from "./components/RedirectOnWrongDomain";
import { ApolloClientProvider } from "./apollo/ApolloClientProvider";
import { Router } from "./Router";

function App() {
  return (
    <ConfigContextProvider>
      <ApolloClientProvider>
        <RedirectOnWrongDomain>
          <Router />
        </RedirectOnWrongDomain>
      </ApolloClientProvider>
    </ConfigContextProvider>
  );
}

export default App;
