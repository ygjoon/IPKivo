import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { t } from "@/i18n";
import { endpoint } from "@/lib/network";
import { createRoot } from "react-dom/client";
import { VerificationWidget } from "./verification-widget";

export type PingVerification = {
  provider: "turnstile" | "turnstile-noninteractive";
  token: string;
};
type ChallengeProvider = {
  id: PingVerification["provider"];
  name: string;
  configured: boolean;
  reason?: string;
  sitekey?: string;
};
type TurnstileProvider = ChallengeProvider & { sitekey: string };

export async function getPingVerification(
  signal: AbortSignal,
): Promise<PingVerification> {
  signal.throwIfAborted();
  const providers = (
    await endpoint<ChallengeProvider[]>("/browser/challenges", { signal })
  ).filter(
    (provider): provider is TurnstileProvider =>
      provider.configured && !!provider.sitekey,
  );
  signal.throwIfAborted();
  const provider =
    providers.find((item) => item.id === "turnstile") ?? providers[0];
  if (!provider) throw new Error(t("api.verificationServiceConfiguredSite"));
  return new Promise<PingVerification>((resolve, reject) => {
    const mount = document.createElement("div");
    document.body.append(mount);
    const root = createRoot(mount);
    let settled = false;
    const finish = (token?: string, error?: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      queueMicrotask(() => {
        root.unmount();
        mount.remove();
      });
      if (token) resolve({ provider: provider.id, token });
      else reject(error);
    };
    const abort = () => finish(undefined, signal.reason);
    const cancel = () =>
      finish(undefined, new DOMException(t("common.cancelled"), "AbortError"));
    const timer = setTimeout(
      () => finish(undefined, new Error(t("challenges.verificationTimedOut"))),
      120_000,
    );
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    else
      root.render(
        <ResponsiveDialog
          open
          onOpenChange={(open) => {
            if (!open) cancel();
          }}
          title={t("common.humanVerification")}
          description={t("ping.verifyBeforeMeasurement")}
        >
          <p className="text-sm text-muted-foreground" role="status">
            {t("challenges.awaitingVerification")}
          </p>
          <VerificationWidget
            sitekey={provider.sitekey}
            onToken={(token) => finish(token)}
            onError={(error) => finish(undefined, error)}
          />
        </ResponsiveDialog>,
      );
  });
}
