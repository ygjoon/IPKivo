import { t } from "@/i18n";
import { CloudflareTest } from "./components/cloudflare-test";

export default function SpeedtestPage() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">{t("speedtest.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("speedtest.description")}
        </p>
      </div>
      <CloudflareTest />
    </div>
  );
}
