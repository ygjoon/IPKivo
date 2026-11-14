import { useEffect, useRef } from "react";
import { t } from "@/i18n";
import { loadWidget, type WidgetApi } from "@/lib/challenge-widget";

export function VerificationWidget({
  sitekey,
  onToken,
  onError,
}: {
  sitekey: string;
  onToken: (token: string) => void;
  onError: (error: Error) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let active = true;
    let api: WidgetApi | undefined;
    let widget: string | number | undefined;
    void loadWidget()
      .then((loaded) => {
        if (!active) return;
        api = loaded;
        widget = api.render(host, {
          sitekey,
          action: "ping_start",
          size: "flexible",
          callback: (token: string) => {
            if (active) onToken(token);
          },
          retry: "never",
          "refresh-expired": "manual",
          "refresh-timeout": "manual",
          "error-callback": () => {
            if (active)
              onError(
                new Error(
                  t("api.verificationServiceUnavailablePleaseRetryLater"),
                ),
              );
          },
          "expired-callback": () => {
            if (active)
              onError(
                new Error(
                  t("api.verificationFailedTokenExpiredPleaseVerifyAgain"),
                ),
              );
          },
          "timeout-callback": () => {
            if (active)
              onError(new Error(t("challenges.verificationTimedOut")));
          },
        });
      })
      .catch((error) => {
        if (active) onError(error);
      });
    return () => {
      active = false;
      if (api && widget !== undefined) {
        try {
          if (api.remove) api.remove(widget);
          else api.reset(widget);
        } catch {
          /* Widget may have already removed itself. */
        }
      }
      host.replaceChildren();
    };
  }, [sitekey, onToken, onError]);
  return <div ref={container} className="min-h-20 w-full overflow-x-auto" />;
}
