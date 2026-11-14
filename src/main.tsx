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

function scheduleDeferredScripts() {
  if (typeof window === "undefined") return;
  const loadScripts = () => {
    if (!document.getElementById("adsense-js")) {
      const ads = document.createElement("script");
      ads.id = "adsense-js";
      ads.async = true;
      ads.crossOrigin = "anonymous";
      ads.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9698370041410113";
      document.head.append(ads);
    }
    if (!document.getElementById("LA_COLLECT")) {
      const cfg: { id: string; ck: string; d?: HTMLScriptElement } = {
        id: "3Rp6B9pBqXU8vzLU",
        ck: "3Rp6B9pBqXU8vzLU",
      };
      const win = window as Window & {
        LA?: { ids?: Array<{ id: string; ck: string; d?: HTMLScriptElement }> };
      };
      const la = document.createElement("script");
      la.id = "LA_COLLECT";
      la.type = "text/javascript";
      la.charset = "UTF-8";
      la.async = true;
      la.src = `${window.location.protocol === "https:" ? "https:" : "http:"}//sdk.51.la/js-sdk-pro.min.js`;
      cfg.d = la;
      if (win.LA?.ids) {
        win.LA.ids.push(cfg);
      } else {
        win.LA = { ...cfg, ids: [cfg] };
      }
      document.head.append(la);
    }
  };
  const scheduleIdle = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadScripts, { timeout: 3000 });
    } else {
      globalThis.setTimeout(loadScripts, 1500);
    }
  };
  if (document.readyState === "complete") scheduleIdle();
  else window.addEventListener("load", scheduleIdle, { once: true });
}

scheduleDeferredScripts();

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
