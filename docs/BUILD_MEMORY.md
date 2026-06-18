# Aipify Build Memory — Stable Settings

Documented after locale graph reduction (customerApp monolith removed from layout).

## Vercel build

| Setting | Value |
|---------|--------|
| **Build command** | `npm run build` (see `vercel.json` + `package.json`) |
| **Build machine** | **Enhanced (16 GB RAM) required** — Project or Team → Settings → Build and Deployment → Build Machines → Enhanced |
| **Node heap** | `NODE_OPTIONS=--max-old-space-size=14336` (14 GB) — set in `vercel.json` **and** inline in `package.json` `build` script |

**Important:** A 14 GB Node heap on Vercel’s **Standard** build machine (8 GB RAM) causes OS-level **SIGKILL**. Local builds succeed because the machine has enough RAM. On Vercel you must use **Enhanced** (16 GB) when using this heap size.

`VERCEL_BUILD_MACHINE_TYPE` is **not** a supported env var — configure Enhanced in the Vercel dashboard (or team-level Build and Deployment settings).

See `vercel.json`.

## Next.js / Webpack

| Setting | Value | Notes |
|---------|--------|--------|
| **webpackBuildWorker** | `false` | Worker IPC `JSON.stringify` hit V8 max string length on this repo size |
| **webpackMemoryOptimizations** | `true` | |
| **cpus** | `1` | |
| **productionBrowserSourceMaps** | `false` | |
| **serverSourceMaps** | `false` | |
| **webpack cache (prod)** | `false` | Reduces cache serialization pressure |

Locale JSON is excluded from the webpack module graph via `IgnorePlugin` in `next.config.ts`.

## Locale import strategy

### Do not load globally

- **`locales/*/customerApp.json`** (~2.5 MB) — source for split generation only; never imported at layout or compile time.
- **No** `dashboard`, `auth`, `license`, `presence`, or full `customerApp` in `app/app/layout.tsx`.

### Layout dictionary (`getAppLayoutDictionary`)

Loads **three** lightweight sources via **filesystem** (`lib/i18n/load-namespace.ts` + `server-only`):

1. **`common`** — `locales/{locale}/common.json`
2. **`shell`** — `locales/{locale}/shell.json` (~6 KB) — sidebar, topbar, search, roles, commandBar, license sidebar, branding, 2FA badge, org switcher, companion/VOC widget strings
3. **`navigation`** — `locales/{locale}/customer-app/navigation.json` **nav + navGroups only** (~25 KB after `portalStructure` split)

Regenerate shell files after changing layout chrome strings:

```bash
node scripts/generate-shell-locale.mjs
```

Regenerate customer-app splits after editing `customerApp.json`:

```bash
node scripts/generate-customer-app-split-locales.mjs
node scripts/generate-shell-locale.mjs
```

### Feature pages

Use `getCustomerAppDictionaryForModule(locale, moduleKey)` — one split (~tens of KB), not the monolith.

### customer-app splits

| Split | Purpose |
|-------|---------|
| `navigation` | Nav labels (`navigation.nav.*`) |
| `portalStructure` | App portal pages (~240 KB) — loaded per route, not layout |
| `dashboard`, `settings`, `core`, … | Route-scoped module keys |

### Deploy tracing

`outputFileTracingIncludes` includes `./locales/**/*` so fs-loaded JSON is present on Vercel.

### Layout segments (build memory)

`app/app/layout.tsx`, `app/platform/layout.tsx`, and `app/dashboard/layout.tsx` export `dynamic = "force-dynamic"` so 800+ authenticated routes are not statically prerendered at build time.

## API route import graph

### Problem

~2,100+ `app/api/**/route.ts` files inflated the Next.js route graph during build (route discovery + per-route webpack entries). Most phase engines duplicated the same thin handler: auth → Supabase RPC → parse → JSON.

### Mitigations (in repo)

1. **Consolidated engine routes** — canonical `/api/aipify/{slug}/{dashboard|card|actions}` endpoints are served by one catch-all handler (suffix must be last URL segment per Next.js):
   - `app/api/aipify/[...enginePath]/route.ts` — `GET` for dashboard/card, `POST` for actions
   - Registry + lazy parser loaders: `lib/aipify/api-route-registry.generated.ts`
   - Shared logic: `lib/aipify/api-route-handlers.ts`

2. **Direct parse imports** — API routes import `@/lib/aipify/{module}/parse` (or specific submodules like `detection`, `evaluate`, `types`) — not barrel `index.ts` files that re-export everything.

3. **Non-consolidated routes kept** — hosts centers (query params + `lib/core` helpers), multi-method dashboards, nested custom paths (e.g. `strategy/[id]`), and all non-canonical endpoints remain as individual route files.

### After adding phase engine API routes

If new routes match the canonical dashboard/card/actions pattern, regenerate and dedupe:

```bash
npm run generate:aipify-api-registry
```

This scans existing routes, updates the registry, and removes duplicate route files (`--apply`).

### Counts (post-consolidation)

| Metric | Before | After |
|--------|--------|-------|
| Total `app/api/**/route.ts` | ~2,148 | ~1,526 |
| Consolidated engine endpoints | 625 files | 1 catch-all handler + registry |
| Engines in registry | — | 318 slugs |

## Build governance (Phase 431)

| Command | Purpose |
|---------|---------|
| `npm run validate:routes` | Route governance scan — fails on critical violations |
| `npm run validate:routes -- --warn-only` | Development warnings (used by `npm run dev`) |
| `npm run validate:deployment` | Pre-production: routes + typecheck + import scan |
| `npm run scan:routes` | Write `build-governance/route-registry.json` |

Platform Admin: **Operations → Build Health Center** (`/platform/operations/build-health`).

`npm run build` runs `validate:deployment` before every production build.

## Incidents

### 2026-06-18 — Vercel ENOENT marketing client-reference manifest

| Field | Detail |
|-------|--------|
| **Issue** | Vercel deploy failed: missing `(marketing)/page_client-reference-manifest.js` |
| **Root cause** | Duplicate homepage routes — `app/page.tsx` and `app/(marketing)/page.tsx` both resolved to `/`. Next.js wrote NFT trace referencing a manifest that was never emitted for the marketing page. |
| **Fix** | Removed duplicate `app/page.tsx`; marketing home is sole `/` route under `(marketing)/layout.tsx`. |
| **Affected modules** | `app/(marketing)/page.tsx`, Vercel deploy pipeline |
| **Resolution** | Local and Vercel builds pass; Phase 431 governance now blocks duplicate homepage routes |

### 2026-06-18 — API route graph consolidation

| Field | Detail |
|-------|--------|
| **Issue** | Vercel build pressure from ~2,148 API route modules |
| **Root cause** | 625 near-identical phase-engine dashboard/card/actions route files |
| **Fix** | Consolidated to `app/api/aipify/[...enginePath]/route.ts` + generated registry |
| **Affected modules** | `app/api/aipify/*`, `lib/aipify/api-route-registry.generated.ts` |
| **Resolution** | ~622 route files removed; URLs unchanged |

## Local build

```bash
NODE_OPTIONS="--max-old-space-size=14336" npm run build
```
