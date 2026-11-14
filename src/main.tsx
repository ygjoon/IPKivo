import React from "react";
import { BrowserRouter } from "react-router-dom";
import { App } from "@/App";
import { QueryProvider } from "@/components/providers/query-provider";
import { RouteProgress } from "@/components/providers/route-progress";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { initializeLocale } from "@/i18n";
import "@/index.css";
import "@/styles/global.css";
import { WebMcp } from "@/webmcp-registration";
import { Provider } from "jotai";
import ReactDOM from "react-dom/client";

initializeLocale();

function scheduleAdSense() {
  if (typeof window === "undefined") return;
  const loadScript = () => {
    if (document.getElementById("adsense-js")) return;
    const script = document.createElement("script");
    script.id = "adsense-js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9698370041410113";
    document.head.append(script);
  };
  const scheduleIdle = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadScript, { timeout: 3000 });
    } else {
      globalThis.setTimeout(loadScript, 1500);
    }
  };
  if (document.readyState === "complete") scheduleIdle();
  else window.addEventListener("load", scheduleIdle, { once: true });
}

scheduleAdSense();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <ThemeProvider>
        <BrowserRouter>
          <WebMcp />
          <RouteProgress />
          <QueryProvider>
            <App />
          </QueryProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
