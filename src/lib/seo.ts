import seoConfig from "./seo-config.json" with { type: "json" };
import { localizedFaq } from "./seo-faq";

export type SeoLocale = "zh-CN" | "en";

type LocalizedMetadata = { title: string; description: string };
type RouteMetadata = Record<SeoLocale, LocalizedMetadata>;

const routes = seoConfig.routes as Record<string, RouteMetadata>;
const notFoundMetadata = seoConfig.notFound as RouteMetadata;

function normalizedPath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export function resolvePageSeo(pathname: string, locale: SeoLocale) {
  const path = normalizedPath(pathname);
  const ipMatch = path.match(/^\/ip\/([^/]+)$/);
  let routePath = path;
  let canonicalPath = path;
  let ip: string | undefined;

  if (ipMatch) {
    try {
      ip = decodeURIComponent(ipMatch[1]);
      canonicalPath = `/ip/${encodeURIComponent(ip)}`;
      routePath = "/ip/:ip";
    } catch {
      routePath = "";
    }
  }

  const route = routes[routePath];
  const metadata = route?.[locale] ?? notFoundMetadata[locale];
  const replaceIp = (value: string) =>
    ip ? value.replaceAll("{ip}", ip) : value;
  const title = replaceIp(metadata.title);
  const description = replaceIp(metadata.description);
  const faq = route ? localizedFaq(routePath, locale) : [];
  const canonicalUrl = new URL(canonicalPath, seoConfig.origin);
  if (route && locale === "en") canonicalUrl.searchParams.set("lang", "en");

  const alternateZh = new URL(canonicalPath, seoConfig.origin).href;
  const alternateEn = new URL(canonicalPath, seoConfig.origin);
  alternateEn.searchParams.set("lang", "en");
  const canonical = route ? canonicalUrl.href : "";
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
    title,
    description,
    canonical,
    alternateZh,
    alternateEn: alternateEn.href,
    image,
    structuredData: [
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
    ],
  };
}

export function updateDocumentSeo(
  pathname: string,
  search: string,
  preferredLocale: SeoLocale,
) {
  const params = new URLSearchParams(search);
  const langParam = params.get("lang");
  const locale: SeoLocale =
    langParam === "en" || langParam === "zh-CN" ? langParam : preferredLocale;

  // Keep an English page's language in the shareable URL after in-app links.
  if (locale === "en" && langParam !== "en") {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", "en");
    window.history.replaceState(window.history.state, "", url);
  }

  const metadata = resolvePageSeo(pathname, locale);
  document.documentElement.lang = locale;
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
  setMeta("seo-og-image", "property", metadata.image);
  setMeta("seo-twitter-card", "name", "summary");
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
    "seo-hreflang-en",
    "alternate",
    metadata.exists ? metadata.alternateEn : undefined,
    "en",
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
