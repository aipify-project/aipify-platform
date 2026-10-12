/**
 * Job 51 — protected route lifecycle: path failsafe + host access + clear/abort.
 * Synthetic fixtures only — no admin DOM, sessions, or provider calls.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  accessClassFromHostPrivateBoundary,
  resolveWebsiteKompisEffectiveAccessClass,
  resolveWebsiteKompisPublicSurfaceState,
  stepWebsiteKompisProtectedRouteLifecycle,
  type WebsiteKompisProtectedRouteLifecycleSnapshot,
} from "@/lib/marketing/website-kompis-public-surface-contract";
import {
  isPrivateWebsiteKompisPathnameNormalized,
  isPrivateWebsiteKompisSurfacePathname,
  isWebsiteKompisPublicAuthEntryPathname,
  WEBSITE_KOMPIS_SURFACE_PRIVATE_PATH_PREFIXES,
} from "@/lib/marketing/website-kompis-public-site-index/private-paths";
import {
  isPrivateWebsiteKompisPathname,
  sanitizeWebsiteKompisPublicPageContext,
} from "@/lib/marketing/website-kompis-public-page-context";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const loaderSource = readFileSync(path.join(root, "public/embed/website-kompis.js"), "utf8");
const widgetSource = readFileSync(
  path.join(root, "components/embed/WebsiteKompisEmbedWidget.tsx"),
  "utf8",
);

function initialPublic(): WebsiteKompisProtectedRouteLifecycleSnapshot {
  return {
    pathname: "/",
    hostAccessClass: "public",
    surfaceActive: true,
    accessClass: "public",
    heldPageContext: { pathname: "/" },
    askGeneration: 0,
    askAborted: false,
    captureAllowed: true,
    pendingDisclosureRefresh: false,
  };
}

// --- Path policy alignment ---
assert.equal(isPrivateWebsiteKompisSurfacePathname("/admin/synthetic-fixture"), true);
assert.equal(isPrivateWebsiteKompisSurfacePathname("/no/admin/synthetic-fixture"), true);
assert.equal(isPrivateWebsiteKompisSurfacePathname("/billing"), true);
assert.equal(isPrivateWebsiteKompisSurfacePathname("/settings"), true);
assert.equal(isPrivateWebsiteKompisSurfacePathname("/login"), false);
assert.equal(isPrivateWebsiteKompisSurfacePathname("/no/register"), false);
assert.equal(isWebsiteKompisPublicAuthEntryPathname("/login"), true);
assert.equal(isPrivateWebsiteKompisPathnameNormalized("/login"), true);
assert.equal(isPrivateWebsiteKompisPathname("/admin/users"), true);
assert.equal(isPrivateWebsiteKompisPathname("/login"), false);
assert.equal(isPrivateWebsiteKompisPathname("/billing/invoices"), true);

assert.equal(
  sanitizeWebsiteKompisPublicPageContext({
    pathname: "/admin/synthetic-fixture",
    title: "SYNTHETIC_PROTECTED_FIXTURE_ONLY",
    surface: "public",
    textSnippets: ["SYNTHETIC_PROTECTED_FIXTURE_ONLY"],
  }),
  undefined,
);

assert.ok(
  sanitizeWebsiteKompisPublicPageContext({
    pathname: "/login",
    title: "Sign in",
    surface: "public",
  }),
);

// Host public must not override known private path
assert.equal(
  resolveWebsiteKompisEffectiveAccessClass({
    hostAccessClass: "public",
    pathname: "/admin/synthetic-fixture",
  }),
  "private",
);
assert.equal(
  resolveWebsiteKompisPublicSurfaceState({
    accessClass: "public",
    pathname: "/admin/synthetic-fixture",
    installIdPresent: true,
    domainPresent: true,
  }).active,
  false,
);

// Missing/legacy public + public path stays active
assert.equal(
  resolveWebsiteKompisPublicSurfaceState({
    accessClass: "public",
    pathname: "/about",
    installIdPresent: true,
    domainPresent: true,
  }).active,
  true,
);

// Host private / unknown on public path
assert.equal(
  resolveWebsiteKompisPublicSurfaceState({
    accessClass: accessClassFromHostPrivateBoundary(true),
    pathname: "/",
    installIdPresent: true,
    domainPresent: true,
  }).active,
  false,
);
assert.equal(
  resolveWebsiteKompisPublicSurfaceState({
    accessClass: "unknown",
    pathname: "/",
    installIdPresent: true,
    domainPresent: true,
  }).active,
  false,
);

// Login/register remain allowlisted for surface when host says public
assert.equal(
  resolveWebsiteKompisPublicSurfaceState({
    accessClass: "public",
    pathname: "/login",
    installIdPresent: true,
    domainPresent: true,
  }).active,
  true,
);

// --- Lifecycle harness (message/state — no network/provider) ---
let state = initialPublic();

// Public → known-denied via SPA (host still public / silent)
state = stepWebsiteKompisProtectedRouteLifecycle(state, {
  pathname: "/admin/synthetic-fixture",
  hostAccessClass: "public",
  capturePathname: null,
  askInFlight: true,
  scheduleDisclosureRefresh: true,
});
assert.equal(state.surfaceActive, false);
assert.equal(state.accessClass, "private");
assert.equal(state.heldPageContext, null);
assert.equal(state.captureAllowed, false);
assert.equal(state.pendingDisclosureRefresh, false);
assert.equal(state.askAborted, true);
assert.ok(state.askGeneration >= 1);

const generationAfterDeny = state.askGeneration;

// Late capture would be rejected — held stays null
state = stepWebsiteKompisProtectedRouteLifecycle(state, {
  pathname: "/admin/synthetic-fixture",
  hostAccessClass: "public",
  capturePathname: "/admin/synthetic-fixture",
  askInFlight: false,
});
assert.equal(state.heldPageContext, null);
assert.equal(state.surfaceActive, false);

// Host marks private explicitly
state = stepWebsiteKompisProtectedRouteLifecycle(state, {
  pathname: "/dashboard",
  hostAccessClass: "private",
});
assert.equal(state.surfaceActive, false);
assert.equal(state.heldPageContext, null);

// Denied initial load
const deniedInitial = stepWebsiteKompisProtectedRouteLifecycle(initialPublic(), {
  pathname: "/member/inbox",
  hostAccessClass: "public",
});
assert.equal(deniedInitial.surfaceActive, false);
assert.equal(deniedInitial.heldPageContext, null);

// Back to allowed public — fresh context only
state = stepWebsiteKompisProtectedRouteLifecycle(state, {
  pathname: "/",
  hostAccessClass: "public",
  capturePathname: "/",
});
assert.equal(state.surfaceActive, true);
assert.deepEqual(state.heldPageContext, { pathname: "/" });
assert.equal(state.captureAllowed, true);
assert.ok(state.askGeneration >= generationAfterDeny);

// popstate-style return to public faq
state = stepWebsiteKompisProtectedRouteLifecycle(state, {
  pathname: "/faq",
  hostAccessClass: "public",
  capturePathname: "/faq",
});
assert.deepEqual(state.heldPageContext, { pathname: "/faq" });

// Capture miss on public path clears (null ≠ keep)
state = stepWebsiteKompisProtectedRouteLifecycle(
  { ...state, heldPageContext: { pathname: "/faq" } },
  {
    pathname: "/faq",
    hostAccessClass: "public",
    capturePathname: null,
  },
);
assert.equal(state.heldPageContext, null);

// Multiple navigations do not leak pending disclosure on deny
state = stepWebsiteKompisProtectedRouteLifecycle(initialPublic(), {
  pathname: "/admin/a",
  hostAccessClass: "public",
  scheduleDisclosureRefresh: true,
});
state = stepWebsiteKompisProtectedRouteLifecycle(state, {
  pathname: "/admin/b",
  hostAccessClass: "public",
  scheduleDisclosureRefresh: true,
});
assert.equal(state.pendingDisclosureRefresh, false);
assert.equal(state.heldPageContext, null);

// --- Loader / widget source contract ---
assert.match(loaderSource, /resolveEffectiveAccessClass/);
assert.match(loaderSource, /applyAccessClassFromEnvironment/);
assert.match(loaderSource, /clearDisclosureRefreshTimer/);
assert.match(loaderSource, /null must clear/);
assert.match(loaderSource, /patchHistoryMethod\("pushState"\)/);
assert.match(loaderSource, /patchHistoryMethod\("replaceState"\)/);
assert.match(loaderSource, /popstate/);
assert.doesNotMatch(loaderSource, /"\/login"/);
assert.doesNotMatch(loaderSource, /"\/register"/);

for (const prefix of WEBSITE_KOMPIS_SURFACE_PRIVATE_PATH_PREFIXES) {
  assert.match(
    loaderSource,
    new RegExp(`"${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`),
    `loader missing surface private prefix ${prefix}`,
  );
}

assert.match(widgetSource, /surfaceActiveRef/);
assert.match(widgetSource, /abortInFlightAskForSurfaceChange/);
assert.match(widgetSource, /askGenerationRef\.current \+= 1/);
assert.match(widgetSource, /!surfaceActiveRef\.current/);

console.log("website-kompis-protected-route-lifecycle.test.ts: all assertions passed");
