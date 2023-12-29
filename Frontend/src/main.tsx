import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";

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
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
