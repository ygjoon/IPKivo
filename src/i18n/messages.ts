import type zhAi from "./zh-CN/ai.json";
import type zhApi from "./zh-CN/api.json";
import type zhBrowser from "./zh-CN/browser.json";
import type zhCommon from "./zh-CN/common.json";
import type zhHome from "./zh-CN/home.json";
import type zhIp from "./zh-CN/ip.json";
import type zhNetwork from "./zh-CN/network.json";
import type zhPolicy from "./zh-CN/policy.json";
import type zhStatus from "./zh-CN/status.json";
import type zhWhois from "./zh-CN/whois.json";

export type MessageKey =
  | keyof typeof zhCommon
  | keyof typeof zhBrowser
  | keyof typeof zhIp
  | keyof typeof zhNetwork
  | keyof typeof zhWhois
  | keyof typeof zhAi
  | keyof typeof zhStatus
  | keyof typeof zhHome
  | keyof typeof zhPolicy
  | keyof typeof zhApi;

export const supportedLocales = ["zh-CN", "zh-TW", "en", "ja", "ru"] as const;
export type Locale = (typeof supportedLocales)[number];

const loaders: Record<
  Locale,
  () => Promise<{ default: Record<MessageKey, string> }>
> = {
  "zh-CN": () => import("./zh-CN/index.ts"),
  "zh-TW": () => import("./zh-TW/index.ts"),
  en: () => import("./en/index.ts"),
  ja: () => import("./ja/index.ts"),
  ru: () => import("./ru/index.ts"),
};

export async function loadLocaleMessages(
  locale: Locale,
): Promise<Record<MessageKey, string>> {
  const mod = await loaders[locale]();
  return mod.default;
}
