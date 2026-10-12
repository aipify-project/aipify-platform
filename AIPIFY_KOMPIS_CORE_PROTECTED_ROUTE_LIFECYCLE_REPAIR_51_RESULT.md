# AIPIFY KOMPIS CORE — PROTECTED ROUTE LIFECYCLE REPAIR.51 — RESULT

Date: 2026-10-12  
Scope: Core lifecycle repair — hide public Kompis on denied/inactive SPA routes, clear pageContext, abort asks. No Host/SQL/APP UI/travel.

## LIVE

| Field | Value |
|-------|-------|
| PR | [#143](https://github.com/aipify-project/aipify-platform/pull/143) merged |
| SHA | `1d42371b` (merge) · feature `33fa9bdd` |
| Apex | `aipify-platform-iz5z` · `dpl_8upkmvVv8EgXRkx3fsch9rMT3xWh` · **READY** |
| Alias | `aipify.ai` (includes published loader) |
| Loader proof | `https://aipify.ai/embed/website-kompis.js` contains `resolveEffectiveAccessClass` / `applyAccessClassFromEnvironment` / null-must-clear |

Write-gate OFF / reuse OFF. No SQL/secrets/config/ingest/Host.

---

## Allowed files touched

| File | Role |
|------|------|
| `public/embed/website-kompis.js` | Effective access on load/SPA; hide; clear; stop disclosure timers |
| `lib/marketing/website-kompis-public-surface-contract.ts` | `resolveWebsiteKompisEffectiveAccessClass` + lifecycle step helper |
| `lib/marketing/website-kompis-public-site-index/private-paths.ts` | Shared surface vs index path policy; auth-entry carve-out |
| `lib/marketing/website-kompis-public-page-context.ts` | Server sanitize uses surface path helper |
| `components/embed/WebsiteKompisEmbedWidget.tsx` | Abort ask + generation guard on inactive; ignore late pageContext |
| `docs/integrations/website-kompis-public-surface-contract.md` | Host still required; failsafe documented |
| `*.test.ts` (surface, embed, lifecycle) | Acceptance |

---

## Policy / state transitions

| Input | Effective | Widget | pageContext | Ask |
|-------|-----------|--------|-------------|-----|
| Host `public` + public path | `public` | show | fresh capture | allowed |
| Host `public` + `/admin/…` (failsafe) | `private` | hide | **cleared** | abort / blocked |
| Host `private` / `unknown` | inactive | hide | cleared | abort |
| Host missing → legacy `public` + private path | `private` | hide | cleared | abort |
| `/login` `/register` + host `public` | `public` | show | allowed | allowed |
| Capture returns null while “public” | — | — | **cleared** (null ≠ keep) | — |
| Return to `/` or host `public` on public path | `public` | show | **new** capture only | resume |

Host `public` **cannot** override known surface-private prefixes. Path failsafe is **not** complete private-route detection — unknown customer shells still need `data-aipify-kompis-access`.

---

## Local lifecycle evidence

`npx tsx lib/marketing/website-kompis-protected-route-lifecycle.test.ts` (+ surface/embed/page-context/index tests, `tsc --noEmit`):

- Public → `/admin/synthetic-fixture` (host still public): inactive, context null, ask aborted, no disclosure pending  
- In-flight ask generation bump on deny  
- Denied initial; return to `/` → fresh `{pathname:"/"}` only  
- Host inactive/unknown; explicit public on denied path; `/login` stays active under contract  
- Loader source synced to `WEBSITE_KOMPIS_SURFACE_PRIVATE_PATH_PREFIXES` (no `/login`/`/register` in loader deny)  
- Widget source has `surfaceActiveRef` + `abortInFlightAskForSurfaceChange`  

No real admin DOM, signed-in probes, or provider calls.

---

## Remaining host-contract dependency

Core still cannot invent every protected customer URL. Owners must keep publishing access class on SPA navigations for shells outside the shared failsafe list. Install/domain trust ≠ path grant.

---

## Owner UI test (READY — no chat / no private data)

Internal nav: public → protected (known failsafe or host-private) → public.  
Expect: widget hides and clears on protected; returns with closed launcher + fresh public context only.  
Do **not** test by sending admin content into Kompis.

## Owner acceptance (2026-10-12) — OBSERVATION

**OWNER UI/FACT OBSERVATION (not provider/request correlation):** Job51 LIVE accepted for public→admin — Kompis disappeared and did not follow into admin. Owner also reported a correct membership answer. Not a complete all-routes acceptance. Unknown protected shells still need host access contract. Route boundary unchanged by later jobs.

---

## Path register

| Path | Role |
|------|------|
| Job 50 | Diagnosed SPA follow / refresh vanish |
| **Job 51** | **Lifecycle repair LIVE `#143` / `1d42371b` / `dpl_8upkmv…`** |

Travel / historikk / språk / Push-pris / doble kort / APP scope-UI: untouched.

**SAFE TO FREEZE WHOLE CHAIN = NO**
