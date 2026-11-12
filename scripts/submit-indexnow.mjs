import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

const SITE_HOST = "www.ipkivo.com";
const SITE_ORIGIN = "https://" + SITE_HOST;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const commit = process.env.GITHUB_SHA;
const branch = process.env.GITHUB_REF;

if (branch && branch !== "refs/heads/main") {
  console.log("Skipping IndexNow outside the production branch.");
  process.exit(0);
}
if (!commit || !/^[0-9a-f]{40}$/i.test(commit)) {
  throw new Error("GITHUB_SHA must contain the full production commit SHA.");
}

const versionUrl = new URL("/app-version.json", SITE_ORIGIN);
versionUrl.searchParams.set("indexnow-deploy", commit);

let deploymentReady = false;
for (let attempt = 1; attempt <= 60; attempt += 1) {
  try {
    const response = await fetch(versionUrl, {
      cache: "no-store",
      headers: { "cache-control": "no-cache", pragma: "no-cache" },
      signal: AbortSignal.timeout(15_000),
    });
    if (response.ok) {
      const version = await response.json();
      if (version.commit === commit) {
        deploymentReady = true;
        break;
      }
    }
  } catch {
    // The production deployment may still be building or propagating.
  }
  if (attempt < 60) await sleep(15_000);
}
if (!deploymentReady) {
  throw new Error("Timed out waiting for the matching production deployment.");
}
console.log("Production deployment is live: " + commit.slice(0, 8));

const publicDirectory = new URL("../public/", import.meta.url);
const entries = await readdir(publicDirectory, { withFileTypes: true });
const keyFiles = [];
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith(".txt")) continue;
  const contents = (await readFile(new URL(entry.name, publicDirectory), "utf8")).trim();
  if (
    entry.name === contents + ".txt" &&
    /^[A-Za-z0-9-]{8,128}$/.test(contents)
  ) {
    keyFiles.push({ filename: entry.name, key: contents });
  }
}
if (keyFiles.length !== 1) {
  throw new Error("Expected exactly one root IndexNow key file.");
}
const { filename, key } = keyFiles[0];

const keyUrl = new URL("/" + filename, SITE_ORIGIN);
keyUrl.searchParams.set("indexnow-deploy", commit);
const keyResponse = await fetch(keyUrl, {
  cache: "no-store",
  headers: { "cache-control": "no-cache", pragma: "no-cache" },
  signal: AbortSignal.timeout(15_000),
});
if (!keyResponse.ok || (await keyResponse.text()).trim() !== key) {
  throw new Error("The deployed IndexNow key file is missing or has unexpected contents.");
}

function sitemapUrls(xml) {
  const matches = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)];
  const urls = new Set();
  for (const match of matches) {
    const url = new URL(match[1].trim());
    if (url.origin !== SITE_ORIGIN) {
      throw new Error("Sitemap contains a URL outside " + SITE_ORIGIN);
    }
    urls.add(url.href);
  }
  return urls;
}

const currentSitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const urls = sitemapUrls(currentSitemap);
const baseCommit = process.env.GITHUB_EVENT_BEFORE;
if (
  baseCommit &&
  /^[0-9a-f]{40}$/i.test(baseCommit) &&
  !/^0+$/.test(baseCommit)
) {
  try {
    const previousSitemap = execFileSync(
      "git",
      ["show", baseCommit + ":public/sitemap.xml"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    const previousUrls = sitemapUrls(previousSitemap);
    if (previousSitemap !== currentSitemap) {
      for (const url of previousUrls) urls.add(url);
    }
  } catch {
    // A first deployment may not have a previous sitemap.
  }
}

if (urls.size === 0 || urls.size > 10_000) {
  throw new Error("The sitemap must contain between 1 and 10,000 URLs.");
}

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: SITE_HOST,
    key,
    urlList: [...urls],
  }),
  signal: AbortSignal.timeout(30_000),
});
const responseText = await response.text();
if (!response.ok) {
  throw new Error("IndexNow returned HTTP " + response.status + ": " + responseText.slice(0, 500));
}
console.log("IndexNow accepted " + urls.size + " sitemap URLs (HTTP " + response.status + ").");
