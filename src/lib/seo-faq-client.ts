import { isMessageKey, t } from "@/i18n";
import {
  faqKeysByRoute,
  type FaqItem,
  type FaqLocale,
} from "./seo-faq-keys.ts";

export type { FaqItem };

type SupplementalMap = Record<string, readonly FaqItem[]>;

const supplementalCache = new Map<FaqLocale, SupplementalMap>();
const supplementalLoads = new Map<FaqLocale, Promise<SupplementalMap>>();

async function loadSupplemental(locale: FaqLocale): Promise<SupplementalMap> {
  const cached = supplementalCache.get(locale);
  if (cached) return cached;

  let pending = supplementalLoads.get(locale);
  if (!pending) {
    pending = (async () => {
      let data: SupplementalMap;
      switch (locale) {
        case "zh-CN":
          data = (await import("./seo-locales/faq-zh-CN.json")).default;
          break;
        case "en":
          data = (await import("./seo-locales/faq-en.json")).default;
          break;
        case "zh-TW":
          data = (await import("./seo-locales/zh-TW.json")).default
            .supplementalFaqs;
          break;
        case "ja":
          data = (await import("./seo-locales/ja.json")).default
            .supplementalFaqs;
          break;
        case "ru":
          data = (await import("./seo-locales/ru.json")).default
            .supplementalFaqs;
          break;
      }
      supplementalCache.set(locale, data);
      return data;
    })();
    supplementalLoads.set(locale, pending);
  }
  return pending;
}

export function getCachedLocalizedFaq(
  route: string,
  locale: FaqLocale,
): readonly FaqItem[] | undefined {
  const supplemental = supplementalCache.get(locale);
  if (!supplemental) return undefined;
  return buildFaq(route, supplemental);
}

function buildFaq(route: string, supplemental: SupplementalMap): FaqItem[] {
  const resolvedRoute = route === "/ip/:ip" ? "/ip" : route;
  const translatedFaq = (faqKeysByRoute[resolvedRoute] ?? []).map(
    ([questionKey, answerKey]) => ({
      question: isMessageKey(questionKey) ? t(questionKey) : questionKey,
      answer: isMessageKey(answerKey) ? t(answerKey) : answerKey,
    }),
  );
  return [...translatedFaq, ...(supplemental[resolvedRoute] ?? [])];
}

export async function loadLocalizedFaq(
  route: string,
  locale: FaqLocale,
): Promise<FaqItem[]> {
  const supplemental = await loadSupplemental(locale);
  return buildFaq(route, supplemental);
}
