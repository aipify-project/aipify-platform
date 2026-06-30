import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  resetMarketingPageViewDedupForTests,
  shouldIngestMarketingPageView,
  trackEvent,
} from "./analytics";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const recorderPath = path.join(root, "components/marketing/MarketingAnalyticsRecorder.tsx");
const recorderSource = fs.readFileSync(recorderPath, "utf8");

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn();
      console.log(`ok ${name}`);
    } catch (error) {
      console.error(`fail ${name}`);
      throw error;
    }
  })();
}

async function main() {
  await test("recorder uses direct ingest only for page_view", () => {
    assert.doesNotMatch(recorderSource, /trackEvent\(\s*["']page_view["']/);
    assert.match(recorderSource, /shouldIngestMarketingPageView\(pagePath\)/);
    assert.match(recorderSource, /ingestMarketingWebsiteEvent\(buildIngestPayload\("page_view"/);
  });

  await test("event bridge ignores page_view to prevent duplicate ingest", () => {
    assert.match(recorderSource, /detail\.name === "page_view"/);
  });

  await test("shouldIngestMarketingPageView allows one ingest per path", () => {
    resetMarketingPageViewDedupForTests();
    assert.equal(shouldIngestMarketingPageView("/pricing"), true);
    assert.equal(shouldIngestMarketingPageView("/pricing"), false);
  });

  await test("shouldIngestMarketingPageView allows a new path after route change", () => {
    resetMarketingPageViewDedupForTests();
    assert.equal(shouldIngestMarketingPageView("/"), true);
    assert.equal(shouldIngestMarketingPageView("/product"), true);
    assert.equal(shouldIngestMarketingPageView("/product"), false);
  });

  await test("shouldIngestMarketingPageView survives strict-mode remount simulation", () => {
    resetMarketingPageViewDedupForTests();
    assert.equal(shouldIngestMarketingPageView("/about"), true);
    assert.equal(shouldIngestMarketingPageView("/about"), false);
  });

  await test("trackEvent dispatches other marketing events once", () => {
    const events: string[] = [];
    function onMarketingEvent(e: Event) {
      const detail = (e as CustomEvent).detail as { name?: string };
      if (detail?.name) events.push(detail.name);
    }

    globalThis.window = {
      dispatchEvent: (event: Event) => {
        onMarketingEvent(event);
        return true;
      },
    } as Window & typeof globalThis;

    trackEvent("cta_click", { label: "Start trial" });
    assert.deepEqual(events, ["cta_click"]);
  });

  await test("trackEvent does not call GA4 or first-party ingest directly", () => {
    const analyticsSource = fs.readFileSync(path.join(root, "lib/marketing/analytics.ts"), "utf8");
    const trackEventFn = analyticsSource.match(/export function trackEvent[\s\S]*?^}/m)?.[0] ?? "";
    assert.doesNotMatch(trackEventFn, /gtag|googletagmanager|G-8RWDW82MTE/);
    assert.doesNotMatch(trackEventFn, /ingestMarketingWebsiteEvent/);
  });

  console.log("marketing-analytics-recorder tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
