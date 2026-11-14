import { isSupportedLocale, type Locale } from "@/i18n";
import { normalizePublicIp } from "./public-ip";
import seoConfig from "./seo-config.json" with { type: "json" };
import { loadLocalizedFaq } from "./seo-faq-client";

export type SeoLocale = "zh-CN" | "en";

export function toSeoLocale(locale: Locale): SeoLocale {
  return locale === "zh-CN" || locale === "zh-TW" ? "zh-CN" : "en";
}

type LocalizedMetadata = { title: string; description: string };
type RouteMetadata = Record<SeoLocale, LocalizedMetadata>;
type ExtraSeoLocaleBundle = {
  routes: Record<string, LocalizedMetadata>;
  notFound: LocalizedMetadata;
};

const routes = seoConfig.routes as Record<string, RouteMetadata>;
const notFoundMetadata = seoConfig.notFound as RouteMetadata;
const extraBundleCache = new Map<
  Exclude<Locale, SeoLocale>,
  ExtraSeoLocaleBundle
>();

const ogLocales: Record<Locale, string> = {
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  en: "en_US",
  ja: "ja_JP",
  ru: "ru_RU",
};

async function routeMetadataForLocale(routePath: string, locale: Locale) {
  if (locale === "zh-CN" || locale === "en") {
    return routes[routePath]?.[locale] ?? notFoundMetadata[locale];
  }
  let bundle = extraBundleCache.get(locale);
  if (!bundle) {
    switch (locale) {
      case "zh-TW":
        bundle = (await import("./seo-locales/zh-TW.json")).default;
        break;
      case "ja":
        bundle = (await import("./seo-locales/ja.json")).default;
        break;
      case "ru":
        bundle = (await import("./seo-locales/ru.json")).default;
        break;
    }
    extraBundleCache.set(locale, bundle);
  }
  return bundle.routes[routePath] ?? bundle.notFound;
}

function normalizedPath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function localizedHref(canonicalPath: string, locale: Locale) {
  const url = new URL(canonicalPath, seoConfig.origin);
  if (locale !== "zh-CN") url.searchParams.set("lang", locale);
  return url.href;
}

export async function resolvePageSeo(pathname: string, locale: Locale) {
  const path = normalizedPath(pathname);
  const ipMatch = path.match(/^\/ip\/([^/]+)$/);
  let routePath = path;
  let canonicalPath = path;
  let ip: string | undefined;

  if (ipMatch) {
    try {
      ip = normalizePublicIp(decodeURIComponent(ipMatch[1]));
      if (ip) {
        canonicalPath = `/ip/${encodeURIComponent(ip)}`;
        routePath = "/ip/:ip";
      } else {
        routePath = "";
      }
    } catch {
      routePath = "";
    }
  }

  const route = routes[routePath];
  const [metadata, faq] = await Promise.all([
    routeMetadataForLocale(routePath, locale),
    route ? loadLocalizedFaq(routePath, locale) : Promise.resolve([]),
  ]);
  const replaceIp = (value: string) =>
    ip ? value.replaceAll("{ip}", ip) : value;
  const title = replaceIp(metadata.title);
  const description = replaceIp(metadata.description);

  const alternateZh = localizedHref(canonicalPath, "zh-CN");
  const alternateZhTw = localizedHref(canonicalPath, "zh-TW");
  const alternateEn = localizedHref(canonicalPath, "en");
  const alternateJa = localizedHref(canonicalPath, "ja");
  const alternateRu = localizedHref(canonicalPath, "ru");
  const canonical = route ? localizedHref(canonicalPath, locale) : "";
  const image = new URL(seoConfig.image, seoConfig.origin).href;
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: seoConfig.siteName,
      item: new URL("/", seoConfig.origin).href,
    },
    ...(canonicalPath === "/"
      ? []
      : [
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: canonical || new URL(canonicalPath, seoConfig.origin).href,
          },
        ]),
  ];

  return {
    exists: Boolean(route),
    locale,
    ogLocale: ogLocales[locale],
    title,
    description,
    canonical,
    alternateZh,
    alternateZhTw,
    alternateEn,
    alternateJa,
    alternateRu,
    image,
    faq,
    structuredData: route
      ? [
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: seoConfig.siteName,
            url: seoConfig.origin,
            inLanguage: locale,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: seoConfig.siteName,
            url: canonical || seoConfig.origin,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs,
          },
          ...(faq.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faq.map(({ question, answer }) => ({
                    "@type": "Question",
                    name: question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: answer,
                    },
                  })),
                },
              ]
            : []),
        ]
      : [],
  };
}

export async function updateDocumentSeo(
  pathname: string,
  search: string,
  preferredLocale: Locale,
) {
  const params = new URLSearchParams(search);
  const langParam = params.get("lang");
  const activeLocale: Locale = isSupportedLocale(langParam)
    ? langParam
    : preferredLocale;

  // Keep non-default page language in the shareable URL after in-app links.
  if (activeLocale !== "zh-CN" && langParam !== activeLocale) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", activeLocale);
    window.history.replaceState(window.history.state, "", url);
  }

  const metadata = await resolvePageSeo(pathname, activeLocale);
  document.documentElement.lang = activeLocale;
  document.title = metadata.title;

  const setMeta = (id: string, key: "name" | "property", value: string) => {
    let element = document.getElementById(id) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement("meta");
      element.id = id;
      const name = id.replace(/^seo-/, "").replaceAll("-", ":");
      element.setAttribute(key, name);
      document.head.append(element);
    }
    element.setAttribute("content", value);
  };
  const setLink = (
    id: string,
    rel: string,
    href: string | undefined,
    hreflang?: string,
  ) => {
    const existing = document.getElementById(id);
    if (!href) {
      existing?.remove();
      return;
    }
    const element =
      existing instanceof HTMLLinkElement
        ? existing
        : document.createElement("link");
    element.id = id;
    element.rel = rel;
    element.href = href;
    if (hreflang) element.hreflang = hreflang;
    document.head.append(element);
  };

  setMeta("seo-description", "name", metadata.description);
  setMeta(
    "seo-robots",
    "name",
    metadata.exists && window.location.hostname === "www.ipkivo.com"
      ? "index, follow"
      : "noindex, nofollow",
  );
  setMeta("seo-og-type", "property", "website");
  setMeta("seo-og-title", "property", metadata.title);
  setMeta("seo-og-description", "property", metadata.description);
  setMeta("seo-og-url", "property", metadata.canonical || window.location.href);
  setMeta("seo-og-site-name", "property", seoConfig.siteName);
  setMeta("seo-og-locale", "property", metadata.ogLocale);
  setMeta("seo-og-image", "property", metadata.image);
  setMeta("seo-twitter-card", "name", "summary_large_image");
  setMeta("seo-twitter-title", "name", metadata.title);
  setMeta("seo-twitter-description", "name", metadata.description);
  setMeta("seo-twitter-image", "name", metadata.image);
  setLink("seo-canonical", "canonical", metadata.canonical || undefined);
  setLink(
    "seo-hreflang-zh",
    "alternate",
    metadata.exists ? metadata.alternateZh : undefined,
    "zh-CN",
  );
  setLink(
    "seo-hreflang-zh-tw",
    "alternate",
    metadata.exists ? metadata.alternateZhTw : undefined,
    "zh-TW",
  );
  setLink(
    "seo-hreflang-en",
    "alternate",
    metadata.exists ? metadata.alternateEn : undefined,
    "en",
  );
  setLink(
    "seo-hreflang-ja",
    "alternate",
    metadata.exists ? metadata.alternateJa : undefined,
    "ja",
  );
  setLink(
    "seo-hreflang-ru",
    "alternate",
    metadata.exists ? metadata.alternateRu : undefined,
    "ru",
  );
  setLink(
    "seo-hreflang-default",
    "alternate",
    metadata.exists ? metadata.alternateZh : undefined,
    "x-default",
  );

  const jsonLd = document.getElementById("seo-jsonld");
  if (jsonLd)
    jsonLd.textContent = JSON.stringify(metadata.structuredData).replaceAll(
      "<",
      "\\u003c",
    );
}
