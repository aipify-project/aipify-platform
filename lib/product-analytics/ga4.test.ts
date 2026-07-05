import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { Ga4Window } from "./ga4";
import {
  buildGa4ScriptSrc,
  configureGa4Once,
  createOfficialGtagStub,
  disableGa4Tracking,
  gaDisableFlagKey,
  getGa4RuntimeStateForTests,
  handleGa4ScriptLoad,
  resetGa4RuntimeState,
  resolveGaMeasurementId,
  shouldMountGa4Script,
  syncGa4WithConsent,
} from "./ga4";

const MEASUREMENT_ID = "G-8RWDW82MTE";

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

function isArgumentsLike(value: unknown): value is IArguments {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.prototype.toString.call(value) === "[object Arguments]"
  );
}

function argsLikeToArray(args: IArguments): unknown[] {
  return Array.from({ length: args.length }, (_, index) => args[index]);
}

function createMockWindow(): Ga4Window & { gtagCalls: IArguments[] } {
  const dataLayer: unknown[] = [];
  const gtagCalls: IArguments[] = [];
  const gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- mock must store Arguments for parity tests
    gtagCalls.push(arguments);
    // eslint-disable-next-line prefer-rest-params -- mock must store Arguments for parity tests
    dataLayer.push(arguments);
  };
  const windowLike: Ga4Window & { gtagCalls: IArguments[] } = {
    dataLayer,
    gtagCalls,
    gtag: gtag as Ga4Window["gtag"],
  };
  return windowLike;
}

function expectQueuedInit(windowLike: Ga4Window & { gtagCalls: IArguments[] }): void {
  assert.equal(windowLike.gtagCalls.length, 4);
  assert.deepEqual(argsLikeToArray(windowLike.gtagCalls[0]), [
    "consent",
    "default",
    {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  ]);
  assert.deepEqual(argsLikeToArray(windowLike.gtagCalls[1]), [
    "consent",
    "update",
    { analytics_storage: "granted" },
  ]);
  assert.equal(argsLikeToArray(windowLike.gtagCalls[2])[0], "js");
  assert.ok(argsLikeToArray(windowLike.gtagCalls[2])[1] instanceof Date);
  assert.deepEqual(argsLikeToArray(windowLike.gtagCalls[3]), [
    "config",
    MEASUREMENT_ID,
    { send_page_view: true },
  ]);
  for (const entry of windowLike.dataLayer ?? []) {
    assert.equal(isArgumentsLike(entry), true, "dataLayer entries must be Arguments");
    assert.equal(Array.isArray(entry), false, "dataLayer entries must not be Arrays");
  }
}

async function main() {
  await test("measurement ID resolves from env-style value", async () => {
    assert.equal(resolveGaMeasurementId("G-8RWDW82MTE"), MEASUREMENT_ID);
    assert.equal(resolveGaMeasurementId("  "), null);
    assert.equal(resolveGaMeasurementId(undefined), null);
  });

  await test("official gtag stub pushes arguments not rest arrays", async () => {
    const dataLayer: unknown[] = [];
    const gtag = createOfficialGtagStub(dataLayer);
    gtag("config", MEASUREMENT_ID, { send_page_view: true });
    assert.equal(dataLayer.length, 1);
    assert.equal(isArgumentsLike(dataLayer[0]), true);
    assert.equal(Array.isArray(dataLayer[0]), false);
    assert.equal((dataLayer[0] as IArguments)[0], "config");
  });

  await test("missing measurement ID is safe no-op", async () => {
    resetGa4RuntimeState();
    const windowLike = createMockWindow();
    const result = syncGa4WithConsent("granted", null, windowLike, true);
    assert.equal(result.action, "noop");
    assert.equal(result.shouldMountScript, false);
    assert.equal(shouldMountGa4Script("granted", null, true), false);
  });

  await test("unknown consent does not mount script or config", async () => {
    resetGa4RuntimeState();
    const windowLike = createMockWindow();
    const result = syncGa4WithConsent("unknown", MEASUREMENT_ID, windowLike, true);
    assert.equal(result.action, "blocked");
    assert.equal(result.shouldMountScript, false);
    assert.equal(shouldMountGa4Script("unknown", MEASUREMENT_ID, true), false);
    assert.equal(windowLike.gtagCalls.length, 0);
    assert.equal(windowLike[gaDisableFlagKey(MEASUREMENT_ID)], undefined);
  });

  await test("denied consent does not mount script or config", async () => {
    resetGa4RuntimeState();
    const windowLike: Ga4Window = {};
    const result = syncGa4WithConsent("denied", MEASUREMENT_ID, windowLike, true);
    assert.equal(result.action, "disable");
    assert.equal(result.shouldMountScript, false);
    assert.equal(windowLike[gaDisableFlagKey(MEASUREMENT_ID)], true);
    assert.equal(windowLike.gtag, undefined);
    assert.equal(windowLike.dataLayer, undefined);
  });

  await test("granted queues init before script load", async () => {
    resetGa4RuntimeState();
    const windowLike = createMockWindow();

    const sync = syncGa4WithConsent("granted", MEASUREMENT_ID, windowLike, true);
    assert.equal(sync.action, "mount-script");
    assert.equal(sync.shouldMountScript, true);
    assert.equal(buildGa4ScriptSrc(MEASUREMENT_ID), `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
    expectQueuedInit(windowLike);
    assert.equal(getGa4RuntimeStateForTests().configCalled, true);
    assert.equal(getGa4RuntimeStateForTests().scriptLoaded, false);

    handleGa4ScriptLoad(MEASUREMENT_ID);
    assert.equal(windowLike.gtagCalls.length, 4);
    assert.equal(getGa4RuntimeStateForTests().scriptLoaded, true);
  });

  await test("script onLoad does not queue extra js or config", async () => {
    resetGa4RuntimeState();
    const windowLike = createMockWindow();
    syncGa4WithConsent("granted", MEASUREMENT_ID, windowLike, true);
    handleGa4ScriptLoad(MEASUREMENT_ID);
    assert.equal(windowLike.gtagCalls.length, 4);
    assert.equal(configureGa4Once(MEASUREMENT_ID, windowLike), false);
  });

  await test("multiple granted syncs do not duplicate script or config", async () => {
    resetGa4RuntimeState();
    const windowLike = createMockWindow();
    syncGa4WithConsent("granted", MEASUREMENT_ID, windowLike, true);
    handleGa4ScriptLoad(MEASUREMENT_ID);

    const secondSync = syncGa4WithConsent("granted", MEASUREMENT_ID, windowLike, true);
    assert.equal(secondSync.action, "noop");
    assert.equal(secondSync.shouldMountScript, false);
    assert.equal(configureGa4Once(MEASUREMENT_ID, windowLike), false);
    assert.equal(windowLike.gtagCalls.length, 4);
  });

  await test("granted to denied deactivates further tracking in session", async () => {
    resetGa4RuntimeState();
    const windowLike = createMockWindow();
    syncGa4WithConsent("granted", MEASUREMENT_ID, windowLike, true);
    handleGa4ScriptLoad(MEASUREMENT_ID);

    const denied = syncGa4WithConsent("denied", MEASUREMENT_ID, windowLike, true);
    assert.equal(denied.action, "disable");
    assert.equal(denied.shouldMountScript, false);
    assert.equal(windowLike[gaDisableFlagKey(MEASUREMENT_ID)], true);
    assert.deepEqual(argsLikeToArray(windowLike.gtagCalls.at(-1)!), [
      "consent",
      "update",
      { analytics_storage: "denied" },
    ]);
  });

  await test("denied to granted re-enables without duplicate config", async () => {
    resetGa4RuntimeState();
    const windowLike = createMockWindow();
    syncGa4WithConsent("granted", MEASUREMENT_ID, windowLike, true);
    handleGa4ScriptLoad(MEASUREMENT_ID);
    syncGa4WithConsent("denied", MEASUREMENT_ID, windowLike, true);

    const reGranted = syncGa4WithConsent("granted", MEASUREMENT_ID, windowLike, true);
    assert.equal(reGranted.action, "re-enable");
    assert.equal(reGranted.shouldMountScript, false);
    assert.equal(windowLike[gaDisableFlagKey(MEASUREMENT_ID)], false);
    assert.equal(windowLike.gtagCalls.length, 6);
    assert.deepEqual(argsLikeToArray(windowLike.gtagCalls.at(-1)!), [
      "consent",
      "update",
      { analytics_storage: "granted" },
    ]);
    assert.equal(configureGa4Once(MEASUREMENT_ID, windowLike), false);
  });

  await test("denied page load does not mount GA4 script", async () => {
    resetGa4RuntimeState();
    const windowLike = createMockWindow();
    const result = syncGa4WithConsent("denied", MEASUREMENT_ID, windowLike, true);
    assert.equal(result.shouldMountScript, false);
    disableGa4Tracking(MEASUREMENT_ID, windowLike);
    assert.equal(shouldMountGa4Script("denied", MEASUREMENT_ID, true), false);
  });

  await test("consent provider mounts consent-gated GA4 inside existing scope", async () => {
    const provider = fs.readFileSync(
      path.join(process.cwd(), "components/analytics/AnalyticsConsentProvider.tsx"),
      "utf8"
    );
    assert.match(provider, /ConsentGatedGoogleAnalytics/);
    assert.doesNotMatch(provider, /user_id/);
  });

  await test("platform and super layouts still have no analytics consent provider", async () => {
    const platform = fs.readFileSync(path.join(process.cwd(), "app/platform/layout.tsx"), "utf8");
    const superAdmin = fs.readFileSync(path.join(process.cwd(), "app/super/layout.tsx"), "utf8");
    assert.doesNotMatch(platform, /AnalyticsConsentProvider/);
    assert.doesNotMatch(superAdmin, /AnalyticsConsentProvider/);
    assert.doesNotMatch(platform, /ConsentGatedGoogleAnalytics/);
    assert.doesNotMatch(superAdmin, /ConsentGatedGoogleAnalytics/);
  });

  console.log("All GA4 foundation tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
