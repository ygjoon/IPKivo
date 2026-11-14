import {
  faqKeysByRoute,
  type FaqItem,
  type FaqLocale,
} from "./seo-faq-keys.ts";
import faqEn from "./seo-locales/faq-en.json" with { type: "json" };
import faqZhCn from "./seo-locales/faq-zh-CN.json" with { type: "json" };
import jaSeo from "./seo-locales/ja.json" with { type: "json" };
import ruSeo from "./seo-locales/ru.json" with { type: "json" };
import zhTwSeo from "./seo-locales/zh-TW.json" with { type: "json" };
import enNetwork from "../i18n/en/network.json" with { type: "json" };
import enWhois from "../i18n/en/whois.json" with { type: "json" };
import jaNetwork from "../i18n/ja/network.json" with { type: "json" };
import jaWhois from "../i18n/ja/whois.json" with { type: "json" };
import ruNetwork from "../i18n/ru/network.json" with { type: "json" };
import ruWhois from "../i18n/ru/whois.json" with { type: "json" };
import zhNetwork from "../i18n/zh-CN/network.json" with { type: "json" };
import zhWhois from "../i18n/zh-CN/whois.json" with { type: "json" };
import zhTwNetwork from "../i18n/zh-TW/network.json" with { type: "json" };
import zhTwWhois from "../i18n/zh-TW/whois.json" with { type: "json" };

export type { FaqItem, FaqLocale };

const dictionaries: Record<FaqLocale, Record<string, string>> = {
  "zh-CN": { ...zhNetwork, ...zhWhois },
  "zh-TW": { ...zhTwNetwork, ...zhTwWhois },
  en: { ...enNetwork, ...enWhois },
  ja: { ...jaNetwork, ...jaWhois },
  ru: { ...ruNetwork, ...ruWhois },
};

const supplementalByLocale: Record<
  FaqLocale,
  Record<string, readonly FaqItem[]>
> = {
  "zh-CN": faqZhCn,
  "zh-TW": zhTwSeo.supplementalFaqs,
  en: faqEn,
  ja: jaSeo.supplementalFaqs,
  ru: ruSeo.supplementalFaqs,
};

export function localizedFaq(route: string, locale: FaqLocale) {
  const resolvedRoute = route === "/ip/:ip" ? "/ip" : route;
  const dictionary = dictionaries[locale];
  const translatedFaq = (faqKeysByRoute[resolvedRoute] ?? []).map(
    ([questionKey, answerKey]) => ({
      question: dictionary[questionKey],
      answer: dictionary[answerKey],
    }),
  );
  return [
    ...translatedFaq,
    ...(supplementalByLocale[locale][resolvedRoute] ?? []),
  ];
}
