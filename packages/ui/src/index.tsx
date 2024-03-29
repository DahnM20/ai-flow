import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./providers/ThemeProvider";
import { GlobalStyle } from "./components/nodes/Node.styles";
import { SocketProvider } from "./providers/SocketProvider";
import { Fallback } from "./components/tools/Fallback";
import "./i18n";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "allotment/dist/style.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <>
    <GlobalStyle />
    <SocketProvider>
      <ThemeProvider>
        <Suspense fallback={<Fallback />}>
          <ToastContainer />
          <App />
        </Suspense>
      </ThemeProvider>
    </SocketProvider>
  </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
