import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./State/store.ts";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';


const theme = createTheme({
  fontFamily: "Inter, sans-serif",
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
        <Notifications position="top-center"/>
        <ModalsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
