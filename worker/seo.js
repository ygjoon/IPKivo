import { normalizePublicIp } from "../src/lib/public-ip.ts";
import seoConfig from "../src/lib/seo-config.json" with { type: "json" };
import { localizedFaq } from "../src/lib/seo-faq.ts";

const routes = seoConfig.routes;
const notFound = seoConfig.notFound;

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

function matchRoute(pattern, pathname) {
  const patternParts = normalizePath(pattern).split("/").filter(Boolean);
  const pathParts = normalizePath(pathname).split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return undefined;
  const params = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index];
    let actual;
    try {
      actual = decodeURIComponent(pathParts[index]);
    } catch {
      return undefined;
    }
    if (expected.startsWith(":")) params[expected.slice(1)] = actual;
    else if (expected !== actual) return undefined;
  }
  return params;
}

function resolvePage(pathname, locale) {
  const path = normalizePath(pathname);
  let routePath = path;
  let canonicalPath = path;
  let params = {};
  if (!routes[routePath]) {
    const dynamic = matchRoute("/ip/:ip", path);
    if (dynamic) {
      const ip = normalizePublicIp(dynamic.ip);
      if (ip) {
        routePath = "/ip/:ip";
        params = { ip };
        canonicalPath = `/ip/${encodeURIComponent(ip)}`;
      }
    }
  }
  const route = routes[routePath];
  const content = route?.[locale] ?? notFound[locale];
  const interpolate = (value) => {
    let result = value;
    for (const [key, param] of Object.entries(params))
      result = result.replaceAll(`{${key}}`, param);
    return result;
  };
  const title = interpolate(content.title);
  const description = interpolate(content.description);
  const faq = route ? localizedFaq(routePath, locale) : [];
  const canonicalUrl = new URL(canonicalPath, seoConfig.origin);
  if (route && locale === "en") canonicalUrl.searchParams.set("lang", "en");
  const alternateEn = new URL(canonicalPath, seoConfig.origin);
  alternateEn.searchParams.set("lang", "en");
  const canonical = route ? canonicalUrl.href : "";
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
    alternateZh: new URL(canonicalPath, seoConfig.origin).href,
    alternateEn: alternateEn.href,
    image: new URL(seoConfig.image, seoConfig.origin).href,
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
            url: canonical,
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

export function redirectTarget(url) {
  const normalizedPath = normalizePath(url.pathname);
  const redirects = { ...seoConfig.entryRedirects, ...seoConfig.legacyRoutes };
  let target;
  let params;
  if (normalizedPath === "/index.html") target = "/";
  if (!target) {
    for (const [from, to] of Object.entries(redirects)) {
      const match = matchRoute(from, normalizedPath);
      if (match) {
        target = to;
        params = match;
        break;
      }
    }
  }

  const isApex = url.hostname.toLowerCase() === "ipkivo.com";
  const isWww = url.hostname.toLowerCase() === "www.ipkivo.com";
  const needsHttps = url.protocol === "http:" && (isApex || isWww);
  const hasTrailingSlash = url.pathname !== normalizedPath;
  if (!target && !isApex && !needsHttps && !hasTrailingSlash) return undefined;

  const destination = new URL(url.href);
  if (isApex) {
    destination.protocol = "https:";
    destination.hostname = "www.ipkivo.com";
  } else if (needsHttps) {
    destination.protocol = "https:";
  }

  if (target) {
    const [targetPath, targetSearch] = target.split("?");
    let destinationPath = targetPath;
    if (params?.ip && destinationPath === "/ip")
      destinationPath = `/ip/${encodeURIComponent(params.ip)}`;
    destination.pathname = destinationPath;
    if (targetSearch !== undefined) {
      const query = new URLSearchParams(targetSearch);
      const lang = url.searchParams.get("lang");
      if (lang && !query.has("lang")) query.set("lang", lang);
      destination.search = query.toString();
    } else {
      destination.search = url.search;
    }
  } else if (hasTrailingSlash) {
    destination.pathname = normalizedPath;
  }
  return destination;
}

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fallbackBody(metadata) {
  const links =
    metadata.locale === "en"
      ? [
          ["/", "IPKivo overview"],
          ["/ip", "IP lookup"],
          ["/leak/dns", "DNS leak test"],
          ["/leak/webrtc", "WebRTC leak test"],
          ["/unlock/sites", "Website connectivity"],
          ["/unlock/gpt", "ChatGPT connectivity"],
          ["/unlock/claude", "Claude connectivity"],
          ["/speedtest", "Internet speed test"],
          ["/whois", "WHOIS and RDAP lookup"],
          ["/ping", "Global ping test"],
          ["/browser/environment", "Browser environment"],
          ["/browser/fingerprint", "Browser fingerprint"],
          ["/browser/checks", "Browser consistency checks"],
          ["/browser/privacy", "Browser privacy checks"],
          ["/status", "Service status"],
          ["/privacy", "Privacy policy"],
          ["/terms", "Terms of service"],
        ]
      : [
          ["/", "IPKivo 网络概览"],
          ["/ip", "IP 地址查询"],
          ["/leak/dns", "DNS 泄露检测"],
          ["/leak/webrtc", "WebRTC 泄露检测"],
          ["/unlock/sites", "网站连通性检测"],
          ["/unlock/gpt", "ChatGPT 连通性诊断"],
          ["/unlock/claude", "Claude 连通性诊断"],
          ["/speedtest", "网络测速"],
          ["/whois", "WHOIS 与 RDAP 查询"],
          ["/ping", "全球 Ping 测试"],
          ["/browser/environment", "浏览器环境信息"],
          ["/browser/fingerprint", "浏览器指纹检测"],
          ["/browser/checks", "浏览器一致性检测"],
          ["/browser/privacy", "浏览器隐私检测"],
          ["/status", "服务状态"],
          ["/privacy", "隐私政策"],
          ["/terms", "使用条款"],
        ];
  const language = metadata.locale === "en" ? "?lang=en" : "";
  const label = metadata.locale === "en" ? "IPKivo tools" : "IPKivo 工具";
  const faqTitle =
    metadata.locale === "en" ? "Frequently asked questions" : "常见问题";
  const faq = (metadata.faq ?? [])
    .map(
      ({ question, answer }) =>
        `<article><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`,
    )
    .join("");
  const faqMarkup = faq
    ? `<section aria-label="${faqTitle}"><h2>${faqTitle}</h2>${faq}</section>`
    : "";
  return `<main data-seo-fallback><h1>${escapeHtml(metadata.title)}</h1><p>${escapeHtml(metadata.description)}</p><nav aria-label="${label}"><ul>${links
    .map(([path, text]) => `<li><a href="${path}${language}">${text}</a></li>`)
    .join("")}</ul></nav>${faqMarkup}</main>`;
}

function htmlRewriterResponse(response, metadata, status, currentUrl, noindex) {
  const jsonLd = JSON.stringify(metadata.structuredData).replaceAll(
    "<",
    "\\u003c",
  );
  const setMeta = (value) => ({
    element(element) {
      element.setAttribute("content", value);
    },
  });
  const setLink = (rel, href, hreflang) => ({
    element(element) {
      element.setAttribute("rel", rel);
      if (href) element.setAttribute("href", href);
      if (hreflang) element.setAttribute("hreflang", hreflang);
      if (!href) element.remove();
    },
  });

  const transformed = new HTMLRewriter()
    .on("html", {
      element(element) {
        element.setAttribute("lang", metadata.locale);
      },
    })
    .on("title", {
      element(element) {
        element.setInnerContent(metadata.title);
      },
    })
    .on("#root", {
      element(element) {
        element.setInnerContent(fallbackBody(metadata), { html: true });
      },
    })
    .on("#seo-description", setMeta(metadata.description))
    .on("#seo-robots", setMeta(noindex ? "noindex, nofollow" : "index, follow"))
    .on("#seo-og-type", setMeta("website"))
    .on("#seo-og-title", setMeta(metadata.title))
    .on("#seo-og-description", setMeta(metadata.description))
    .on("#seo-og-url", setMeta(metadata.canonical || currentUrl))
    .on("#seo-og-site-name", setMeta(seoConfig.siteName))
    .on("#seo-og-image", setMeta(metadata.image))
    .on("#seo-twitter-card", setMeta("summary_large_image"))
    .on("#seo-twitter-title", setMeta(metadata.title))
    .on("#seo-twitter-description", setMeta(metadata.description))
    .on("#seo-twitter-image", setMeta(metadata.image))
    .on("#seo-canonical", setLink("canonical", metadata.canonical))
    .on(
      "#seo-hreflang-zh",
      setLink(
        "alternate",
        metadata.exists ? metadata.alternateZh : undefined,
        "zh-CN",
      ),
    )
    .on(
      "#seo-hreflang-en",
      setLink(
        "alternate",
        metadata.exists ? metadata.alternateEn : undefined,
        "en",
      ),
    )
    .on(
      "#seo-hreflang-default",
      setLink(
        "alternate",
        metadata.exists ? metadata.alternateZh : undefined,
        "x-default",
      ),
    )
    .on("#seo-jsonld", {
      element(element) {
        element.setInnerContent(jsonLd);
      },
    })
    .transform(response);

  const headers = new Headers(transformed.headers);
  headers.set("Cache-Control", "no-cache");
  headers.delete("Content-Length");
  headers.delete("ETag");
  headers.delete("Content-Encoding");
  if (noindex) headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(transformed.body, {
    status,
    headers,
  });
}

function fallbackHtmlResponse(response, metadata, status, currentUrl, noindex) {
  return response.text().then((source) => {
    const attr = escapeAttribute;
    const jsonLd = JSON.stringify(metadata.structuredData).replaceAll(
      "<",
      "\\u003c",
    );
    let html = source.replace(/<html\b[^>]*>/i, (open) => {
      const updated = open.replace(
        /\blang="[^"]*"/i,
        `lang="${attr(metadata.locale)}"`,
      );
      return /\blang=/i.test(open)
        ? updated
        : updated.replace(/>$/, ` lang="${attr(metadata.locale)}">`);
    });
    html = html.replace(
      /<title>[\s\S]*?<\/title>/i,
      () => `<title>${attr(metadata.title)}</title>`,
    );
    html = html.replace(
      /(<div\b(?=[^>]*\bid="root")[^>]*>)[\s\S]*?(<\/div>)/i,
      (_match, open, close) => `${open}${fallbackBody(metadata)}${close}`,
    );
    const replaceMeta = (id, key, name, value) => {
      const pattern = new RegExp(`<meta\\b(?=[^>]*\\bid="${id}")[^>]*>`, "i");
      return (input) =>
        input.replace(
          pattern,
          `<meta id="${id}" ${key}="${attr(name)}" content="${attr(value)}">`,
        );
    };
    const replaceLink = (id, rel, href, hreflang) => {
      const pattern = new RegExp(`<link\\b(?=[^>]*\\bid="${id}")[^>]*>`, "i");
      return (input) =>
        input.replace(
          pattern,
          href
            ? `<link id="${id}" rel="${rel}"${hreflang ? ` hreflang="${hreflang}"` : ""} href="${attr(href)}">`
            : "",
        );
    };
    html = replaceMeta(
      "seo-description",
      "name",
      "description",
      metadata.description,
    )(html);
    html = replaceMeta(
      "seo-robots",
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow",
    )(html);
    html = replaceMeta("seo-og-type", "property", "og:type", "website")(html);
    html = replaceMeta(
      "seo-og-title",
      "property",
      "og:title",
      metadata.title,
    )(html);
    html = replaceMeta(
      "seo-og-description",
      "property",
      "og:description",
      metadata.description,
    )(html);
    html = replaceMeta(
      "seo-og-url",
      "property",
      "og:url",
      metadata.canonical || currentUrl,
    )(html);
    html = replaceMeta(
      "seo-og-site-name",
      "property",
      "og:site_name",
      seoConfig.siteName,
    )(html);
    html = replaceMeta(
      "seo-og-image",
      "property",
      "og:image",
      metadata.image,
    )(html);
    html = replaceMeta(
      "seo-twitter-card",
      "name",
      "twitter:card",
      "summary_large_image",
    )(html);
    html = replaceMeta(
      "seo-twitter-title",
      "name",
      "twitter:title",
      metadata.title,
    )(html);
    html = replaceMeta(
      "seo-twitter-description",
      "name",
      "twitter:description",
      metadata.description,
    )(html);
    html = replaceMeta(
      "seo-twitter-image",
      "name",
      "twitter:image",
      metadata.image,
    )(html);
    html = replaceLink("seo-canonical", "canonical", metadata.canonical)(html);
    html = replaceLink(
      "seo-hreflang-zh",
      "alternate",
      metadata.exists ? metadata.alternateZh : undefined,
      "zh-CN",
    )(html);
    html = replaceLink(
      "seo-hreflang-en",
      "alternate",
      metadata.exists ? metadata.alternateEn : undefined,
      "en",
    )(html);
    html = replaceLink(
      "seo-hreflang-default",
      "alternate",
      metadata.exists ? metadata.alternateZh : undefined,
      "x-default",
    )(html);
    html = html.replace(
      /<script\b(?=[^>]*\bid="seo-jsonld")[^>]*>[\s\S]*?<\/script>/i,
      () =>
        `<script id="seo-jsonld" type="application/ld+json">${jsonLd}</script>`,
    );

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-cache");
    headers.delete("Content-Length");
    headers.delete("ETag");
    headers.delete("Content-Encoding");
    if (noindex) headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(response.body ? html : null, { status, headers });
  });
}

export async function handlePageRequest(request, env) {
  const url = new URL(request.url);
  const redirect = redirectTarget(url);
  if (redirect)
    return new Response(null, {
      status: 301,
      headers: {
        Location: redirect.href,
        "Cache-Control": "public, max-age=86400",
      },
    });

  const response = await env.ASSETS.fetch(request);
  if (
    !response.headers.get("Content-Type")?.toLowerCase().includes("text/html")
  )
    return response;

  const lang = url.searchParams.get("lang");
  const locale = lang === "en" ? "en" : "zh-CN";
  const metadata = resolvePage(url.pathname, locale);
  const status = metadata.exists ? response.status : 404;
  const nonCanonicalHost = url.hostname.toLowerCase() !== "www.ipkivo.com";
  const noindex = !metadata.exists || nonCanonicalHost;

  if (typeof HTMLRewriter === "function")
    return htmlRewriterResponse(response, metadata, status, url.href, noindex);
  return fallbackHtmlResponse(response, metadata, status, url.href, noindex);
}
