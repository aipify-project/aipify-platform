import assert from "node:assert/strict";
import {
  accessClassFromHostPrivateBoundary,
  buildWebsiteKompisEmbedSurfaceMessage,
  parseWebsiteKompisEmbedSurfaceMessage,
  parseWebsiteKompisPublicAccessClass,
  readWebsiteKompisAccessClassFromAdapter,
  resolveWebsiteKompisEffectiveAccessClass,
  resolveWebsiteKompisPublicSurfaceState,
  transitionWebsiteKompisPublicSurface,
  WEBSITE_KOMPIS_EMBED_SURFACE_MESSAGE_TYPE,
} from "@/lib/marketing/website-kompis-public-surface-contract";

assert.equal(parseWebsiteKompisPublicAccessClass("public"), "public");
assert.equal(parseWebsiteKompisPublicAccessClass("PRIVATE"), "private");
assert.equal(parseWebsiteKompisPublicAccessClass("nope"), "unknown");
assert.equal(parseWebsiteKompisPublicAccessClass(null), "unknown");

// Tenant A — marketing site with /sign-in (unknown to Core; host marks public).
const tenantAPublic = resolveWebsiteKompisPublicSurfaceState({
  accessClass: accessClassFromHostPrivateBoundary(false),
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(tenantAPublic.active, true);
assert.equal(tenantAPublic.allowPageContext, true);
assert.equal(tenantAPublic.reason, "public_active");

// Tenant A — authenticated workspace (host boundary private).
const tenantAPrivate = resolveWebsiteKompisPublicSurfaceState({
  accessClass: accessClassFromHostPrivateBoundary(true),
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(tenantAPrivate.active, false);
assert.equal(tenantAPrivate.allowPageContext, false);
assert.equal(tenantAPrivate.clearPageContext, true);

// Tenant B — different route shape (/auth/join public entry, /workspace private).
const tenantBJoin = resolveWebsiteKompisPublicSurfaceState({
  accessClass: "public",
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(tenantBJoin.active, true);
const tenantBWorkspace = resolveWebsiteKompisPublicSurfaceState({
  accessClass: "private",
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(tenantBWorkspace.active, false);

// Unknown never activates or captures context.
const unknown = resolveWebsiteKompisPublicSurfaceState({
  accessClass: "unknown",
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(unknown.active, false);
assert.equal(unknown.allowPageContext, false);

// Kill switch / invalid install.
assert.equal(
  resolveWebsiteKompisPublicSurfaceState({
    accessClass: "public",
    installEnabled: false,
    installIdPresent: true,
    domainPresent: true,
  }).reason,
  "install_disabled",
);
assert.equal(
  resolveWebsiteKompisPublicSurfaceState({
    accessClass: "public",
    installIdPresent: false,
    domainPresent: true,
  }).active,
  false,
);

// Adapter read order: document > script > window > legacy default.
assert.equal(
  readWebsiteKompisAccessClassFromAdapter({
    documentElementAccess: "private",
    scriptAccess: "public",
    windowAccess: "public",
  }),
  "private",
);
assert.equal(
  readWebsiteKompisAccessClassFromAdapter({
    scriptAccess: "public",
  }),
  "public",
);
assert.equal(readWebsiteKompisAccessClassFromAdapter({}), "unknown");
assert.equal(
  readWebsiteKompisAccessClassFromAdapter({ legacyMountedWithoutAdapter: true }),
  "public",
);

// Navigation lifecycle: public → private clears; private → public reactivates.
const toPrivate = transitionWebsiteKompisPublicSurface({
  previous: tenantAPublic,
  nextAccessClass: "private",
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(toPrivate.becameInactive, true);
assert.equal(toPrivate.shouldClearPageContext, true);
assert.equal(toPrivate.state.active, false);

const backToPublic = transitionWebsiteKompisPublicSurface({
  previous: toPrivate.state,
  nextAccessClass: "public",
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(backToPublic.becameActive, true);
assert.equal(backToPublic.state.active, true);
assert.equal(backToPublic.state.allowPageContext, true);

// Soft public→public keeps context permission.
const stayPublic = transitionWebsiteKompisPublicSurface({
  previous: tenantAPublic,
  nextAccessClass: "public",
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(stayPublic.becameInactive, false);
assert.equal(stayPublic.state.allowPageContext, true);

const surfaceMessage = buildWebsiteKompisEmbedSurfaceMessage(toPrivate.state, {
  clearPageContext: true,
});
assert.equal(surfaceMessage.type, WEBSITE_KOMPIS_EMBED_SURFACE_MESSAGE_TYPE);
assert.deepEqual(parseWebsiteKompisEmbedSurfaceMessage(surfaceMessage), surfaceMessage);
assert.equal(parseWebsiteKompisEmbedSurfaceMessage({ type: "other" }), null);

// Core never encodes customer-specific product routes — only access class + shared failsafe.
assert.doesNotMatch(
  String(accessClassFromHostPrivateBoundary),
  /unonight/i,
);

assert.equal(
  resolveWebsiteKompisEffectiveAccessClass({
    hostAccessClass: "public",
    pathname: "/admin/panel",
  }),
  "private",
);
assert.equal(
  resolveWebsiteKompisEffectiveAccessClass({
    hostAccessClass: "public",
    pathname: "/login",
  }),
  "public",
);

const pathDenyWins = transitionWebsiteKompisPublicSurface({
  previous: tenantAPublic,
  nextAccessClass: "public",
  pathname: "/admin/panel",
  installEnabled: true,
  installIdPresent: true,
  domainPresent: true,
});
assert.equal(pathDenyWins.state.active, false);
assert.equal(pathDenyWins.shouldClearPageContext, true);

console.log("website-kompis-public-surface-contract.test.ts: all assertions passed");
