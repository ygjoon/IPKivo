import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { localizeApiMessage } from "../src/i18n/api-message.ts";
import { resolveLocale, supportedLocales, t } from "../src/i18n/index.ts";
import { loadLocaleMessages } from "../src/i18n/messages.ts";

const localeMessages = Object.fromEntries(
  await Promise.all(
    supportedLocales.map(async (loc) => [loc, await loadLocaleMessages(loc)]),
  ),
);
const zh = localeMessages["zh-CN"];
test("saved language wins; otherwise defaults to zh-CN", () => {
  assert.equal(resolveLocale("en", ["zh-CN"]), "en");
  assert.equal(resolveLocale("zh-CN", ["en-US"]), "zh-CN");
  assert.equal(resolveLocale("zh-TW", ["en-US"]), "zh-TW");
  assert.equal(resolveLocale("ja", ["en-US"]), "ja");
  assert.equal(resolveLocale("ru", ["en-US"]), "ru");
  assert.equal(resolveLocale(null, ["zh-TW"]), "zh-CN");
  assert.equal(resolveLocale("invalid", ["fr-FR"]), "zh-CN");
  assert.equal(resolveLocale(null, []), "zh-CN");
});
test("interpolation leaves user values intact", () => {
  assert.equal(t("api.requestFailed", [503]), "请求失败 (503)");
  assert.equal(
    t("api.requestFailed", ["{1} <script>"]),
    "请求失败 ({1} <script>)",
  );
});
test("all supported locales have complete entries and matching placeholders", () => {
  const baseKeys = Object.keys(zh);
  for (const loc of supportedLocales) {
    const dict = localeMessages[loc];
    assert.deepEqual(
      Object.keys(dict),
      baseKeys,
      `${loc}: key parity mismatch`,
    );
    for (const key of baseKeys) {
      assert.ok(
        typeof dict[key] === "string" && dict[key].length > 0,
        `${loc}: empty value for ${key}`,
      );
      assert.deepEqual(
        dict[key].match(/\{\d+\}/g)?.sort() ?? [],
        zh[key].match(/\{\d+\}/g)?.sort() ?? [],
        `${loc}: placeholder mismatch for ${key}`,
      );
    }
  }
});
test("all literal translation calls have entries in all locales and matching placeholders", () => {
  function scan(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(file);
        continue;
      }
      if (!/\.tsx?$/.test(file)) continue;
      const source = readFileSync(file, "utf8");
      const calls = /\bt\(\s*"((?:\\.|[^"\\])*)"/g;
      for (const match of source.matchAll(calls)) {
        const key = JSON.parse(`"${match[1]}"`);
        for (const loc of supportedLocales) {
          const dict = localeMessages[loc];
          assert.ok(dict[key], `${file}: ${loc} missing ${key}`);
          assert.deepEqual(
            dict[key].match(/\{\d+\}/g)?.sort() ?? [],
            zh[key].match(/\{\d+\}/g)?.sort() ?? [],
            `${loc}: ${key}`,
          );
        }
      }
    }
  }
  scan("src");
});

test("English runtime translates messages and switches with blocked storage without losing route state", async () => {
  let destination;
  globalThis.window = {
    location: {
      href: "https://example.test/status?group=AI&lang=en#details",
      assign: (url) => {
        destination = url;
      },
    },
  };
  globalThis.localStorage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  try {
    const runtime = await import("../src/i18n/index.ts?english-test");
    assert.equal(runtime.locale, "en");
    assert.equal(runtime.t("navigation.serviceStatus"), "Service status");
    assert.equal(runtime.t("api.requestFailed", [503]), "Request failed (503)");
    assert.equal(
      runtime.t("api.upstreamUnavailable", [502]),
      "Upstream source unavailable (502)",
    );
    assert.equal(
      localizeApiMessage("Untranslated upstream text"),
      "Untranslated upstream text",
    );
    runtime.setLocale("zh-CN");
    assert.equal(
      destination,
      "https://example.test/status?group=AI&lang=zh-CN#details",
    );
  } finally {
    delete globalThis.window;
    delete globalThis.localStorage;
  }
});
