import React from "react";
import { Router } from "./Router";
import { ConfigContextProvider } from "./context/ConfigContext";
import { RedirectOnWrongDomain } from "./components/RedirectOnWrongDomain";
import { ApolloClientProvider } from "./apollo/ApolloClientProvider";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";

function App() {
  return (
    <CssBaseline>
      <GlobalStyles
        styles={{ a: { textDecoration: "underline dotted", color: "#44bb44" } }}
      />
      <ThemeProvider theme={theme}>
        <ConfigContextProvider>
          <RedirectOnWrongDomain>
            <ApolloClientProvider>
              <Router />
            </ApolloClientProvider>
          </RedirectOnWrongDomain>
        </ConfigContextProvider>
      </ThemeProvider>
    </CssBaseline>
  );
}

export default App;
