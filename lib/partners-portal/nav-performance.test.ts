/**
 * Contract: CSP seller-portal menu navigation must not re-fetch the partner
 * overview on every route change, and must not block the shell behind a
 * client AuthGuard loader when the layout already authorized the session.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

test("layout lifts CSP portal session and skips blocking AuthGuard loader", () => {
  const layout = read("app/partners/layout.tsx");
  const provider = read("components/partners-portal/CspPortalSessionProvider.tsx");
  const workspace = read("components/partners-portal/CertifiedSalesPartnerWorkspacePanel.tsx");
  const guard = read("components/partners-portal/PartnersPortalAuthGuard.tsx");
  const access = read("lib/partners-portal/server-access.ts");

  assert.match(layout, /CspPortalSessionProvider/);
  assert.match(layout, /serverAuthorized/);
  assert.match(provider, /\/api\/certified-sales-partner\/portal/);
  assert.match(provider, /hasLoadedOnce/);
  assert.match(provider, /TOKEN_REFRESHED/);
  assert.match(workspace, /useOptionalCspPortalSession/);
  assert.match(workspace, /CspPortalSessionProvider/);
  assert.doesNotMatch(workspace, /fetch\("\/api\/certified-sales-partner\/portal"/);
  assert.match(guard, /serverAuthorized/);
  assert.match(guard, /TOKEN_REFRESHED/);
  assert.match(access, /Promise\.all/);
  assert.match(access, /avatarUrl/);
});

test("server access still fail-closes suspended partners without caching grants", () => {
  const access = read("lib/partners-portal/server-access.ts");
  const guard = read("components/partners-portal/PartnersPortalAuthGuard.tsx");
  const provider = read("components/partners-portal/CspPortalSessionProvider.tsx");
  assert.match(access, /isCspPartnerPortalStatusAllowed/);
  assert.doesNotMatch(access, /unstable_cache|revalidateTag/);
  assert.match(guard, /\/api\/partners-portal\/access/);
  assert.match(guard, /cache: "no-store"/);
  assert.match(provider, /cache: "no-store"/);
});

test("shell records soft-nav performance marks without inventing timings", () => {
  const shell = read("components/partners-portal/PartnersPortalShell.tsx");
  const perf = read("lib/partners-portal/soft-nav-perf.ts");
  assert.match(shell, /markPartnersSoftNavStart/);
  assert.match(shell, /markPartnersSoftNavReady/);
  assert.match(shell, /mount hydrate only/);
  assert.match(perf, /performance\.mark/);
  assert.match(perf, /performance\.measure/);
});

test("partners routes refresh auth session like app/platform (first-click soft nav)", () => {
  const proxy = read("proxy.ts");
  assert.match(proxy, /pathname\.startsWith\("\/partners"\)/);
  const provider = read("components/partners-portal/CspPortalSessionProvider.tsx");
  assert.match(provider, /onVisibility/);
  assert.match(provider, /removeEventListener\("visibilitychange"/);
  assert.match(provider, /loadSeq/);
  assert.match(provider, /!hasLoadedOnce\.current/);
});

console.log("csp portal nav performance contract passed");
