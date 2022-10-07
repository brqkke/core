import React from "react";
import { Router } from "./Router";
import { ConfigContextProvider } from "./context/ConfigContext";
import { RedirectOnWrongDomain } from "./components/RedirectOnWrongDomain";

function App() {
  return (
    <ConfigContextProvider>
      <RedirectOnWrongDomain>
        <Router />
      </RedirectOnWrongDomain>
    </ConfigContextProvider>
  );
}

export default App;
