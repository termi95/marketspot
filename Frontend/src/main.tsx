import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./State/store.ts";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  fontFamily: "Ubuntu",
  fontSizes: {
    xs: "0.6rem",
    sm: "0.75rem",
    md: "0.9rem",
    lg: "1rem",
    xl: "1.2rem",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>        
      <Notifications position="top-center" zIndex={1000} />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
