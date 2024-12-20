import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/app.scss";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
