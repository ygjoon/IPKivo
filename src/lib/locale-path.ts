import type { Locale } from "@/i18n";

/** Keep internal links on the current language's crawlable URL. */
export function localePath(path: string, locale: Locale) {
  const url = new URL(path, "https://www.ipkivo.com");
  if (url.origin !== "https://www.ipkivo.com") return path;
  if (locale !== "zh-CN") url.searchParams.set("lang", locale);
  else if (url.searchParams.has("lang")) url.searchParams.delete("lang");
  return `${url.pathname}${url.search}${url.hash}`;
}
