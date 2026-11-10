import type { Locale } from "@/i18n";

/** Keep internal links on the current language's crawlable URL. */
export function localePath(path: string, locale: Locale) {
  const url = new URL(path, "https://www.ipkivo.com");
  if (url.origin !== "https://www.ipkivo.com") return path;
  if (locale === "en") url.searchParams.set("lang", "en");
  else if (url.searchParams.get("lang") === "en")
    url.searchParams.delete("lang");
  return `${url.pathname}${url.search}${url.hash}`;
}
