import React from "react";
import { Router } from "./Router";
import { ConfigContextProvider } from "./context/ConfigContext";
import { RedirectOnWrongDomain } from "./components/RedirectOnWrongDomain";
import { ApolloClientProvider } from "./apollo/ApolloClientProvider";

function App() {
  return (
    <ConfigContextProvider>
      <RedirectOnWrongDomain>
        <ApolloClientProvider>
          <Router />
        </ApolloClientProvider>
      </RedirectOnWrongDomain>
    </ConfigContextProvider>
  );
}

export default App;
