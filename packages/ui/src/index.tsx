import "./init";

import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "react-toastify/dist/ReactToastify.css";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./providers/ThemeProvider";
import { GlobalStyle } from "./components/nodes/Node.styles";
import { Fallback } from "./components/tools/Fallback";
import "./i18n";
import { ToastContainer } from "react-toastify";
import Main from "./Main";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const theme = createTheme({});

root.render(
  <>
    <GlobalStyle />
    <MantineProvider theme={theme} forceColorScheme="dark">
      <ThemeProvider>
        <Suspense fallback={<Fallback />}>
          <ToastContainer />
          <Main />
        </Suspense>
      </ThemeProvider>
    </MantineProvider>
  </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
