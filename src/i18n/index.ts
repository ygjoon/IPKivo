import {
  loadLocaleMessages,
  supportedLocales,
  type Locale,
  type MessageKey,
} from "./messages.ts";

export { supportedLocales, type Locale, type MessageKey };
const storageKey = "ip-tools:locale";

export function isSupportedLocale(value: string | null): value is Locale {
  return (
    value !== null && (supportedLocales as readonly string[]).includes(value)
  );
}

export function resolveLocale(
  saved: string | null,
  _languages: readonly string[] = [],
): Locale {
  if (isSupportedLocale(saved)) return saved;
  return "zh-CN";
}

function initialLocale(): Locale {
  if (typeof window === "undefined") return "zh-CN";
  // The URL also keeps language switching usable when storage is blocked.
  const override = new URL(window.location.href).searchParams.get("lang");
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(storageKey);
  } catch {
    /* Storage may be disabled. */
  }
  return resolveLocale(isSupportedLocale(override) ? override : saved);
}

export const locale = initialLocale();
const dictionary = await loadLocaleMessages(locale);
const placeholder = /\{(\d+)\}/g;

export function isMessageKey(key: string): key is MessageKey {
  return Object.hasOwn(dictionary, key);
}

export function t(key: MessageKey, values: readonly unknown[] = []): string {
  return dictionary[key].replace(placeholder, (match, index: string) =>
    Number(index) < values.length ? String(values[Number(index)]) : match,
  );
}

export function setLocale(next: Locale) {
  if (next === locale) return;
  try {
    localStorage.setItem(storageKey, next);
  } catch {
    /* URL fallback below. */
  }
  const url = new URL(window.location.href);
  url.searchParams.set("lang", next);
  window.location.assign(url.href);
}

export function initializeLocale() {
  document.documentElement.lang = locale;
}
