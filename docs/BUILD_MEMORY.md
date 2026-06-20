# Aipify Build Memory — Stable Settings

Documented after locale graph reduction (customerApp monolith removed from layout).

## Vercel build

| Setting | Value |
|---------|--------|
| **Build command** | `npm run build` (see `vercel.json` + `package.json`) |
| **Build machine** | **Turbo (60 GB RAM / 30 vCPU)** recommended for production builds — configure in Vercel → Settings → Build and Deployment → Build Machines. Enhanced (16 GB) minimum if Turbo is unavailable. |
| **Split build** | `AIPIFY_SPLIT_BUILD=1` (default) — compile and generate run as separate Node processes |
| **Node heap (compile)** | `AIPIFY_BUILD_HEAP_COMPILE=--max-old-space-size=30720` in `vercel.json` — passed as a direct `node --max-old-space-size=…` CLI flag on the Next.js process in `build-split.mjs` (verified via `heap_size_limit` log). **30 GB** leaves ~30 GB for V8 Worklist native memory + OS on Turbo 60 GB. |
| **Node heap (generate)** | `AIPIFY_BUILD_HEAP_GENERATE=--max-old-space-size=16384` — same direct invocation in a fresh process after compile exits |

**Important:** Do **not** set a global `NODE_OPTIONS` heap on Vercel — it applies to every phase and breaks split-build memory isolation. Do **not** rely on `NODE_OPTIONS` + `npx next` for compile/generate — npm/npx wrappers often spawn child processes that never receive the heap flag (Vercel logs showed OOM at ~15 GB despite `configured_heap_mb=40960`). Invoke `node --max-old-space-size=… ./node_modules/next/dist/bin/next build` directly.

**Turbopack (future):** Next.js 16 defaults to Turbopack. Production still uses `--webpack` until client/server barrel imports are fixed (`AIPIFY_USE_TURBOPACK=1` when ready). Do not enable globally until turbopack build passes locally.

`VERCEL_BUILD_MACHINE_TYPE` is **not** a supported env var — configure Enhanced in the Vercel dashboard (or team-level Build and Deployment settings).

See `vercel.json`.

## Next.js / Webpack

| Setting | Value | Notes |
|---------|--------|--------|
| **webpackBuildWorker** | `false` | Worker IPC `JSON.stringify` hit V8 max string length on this repo size |
| **webpackMemoryOptimizations** | `true` | |
| **cpus** | `1` | |
| **productionBrowserSourceMaps** | `false` | |
| **enablePrerenderSourceMaps** | `false` | Next 16 defaults prerender sourcemaps on — disable to reduce generate memory |
| **serverSourceMaps** | `false` | |
| **webpack cache (prod)** | `false` | Reduces cache serialization pressure |
| **UV_THREADPOOL_SIZE (compile)** | `4` | Set in `build-split.mjs` compile child — limits libuv pool alongside `parallelism: 1` |

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

### TypeScript during `next build`

`next.config.ts` sets `typescript.ignoreBuildErrors: true` so Next.js does **not** run a second full-project `tsc` after webpack compile. Types are enforced once in `validate:deployment` (`npm run typecheck`).

### Split compile / generate

`scripts/build-with-duration.mjs` runs `build-split.mjs --from 2` after validation (skips duplicate typecheck). Webpack **compile** and page-data **generate** run as separate Node processes to reduce peak RAM on Vercel Enhanced.

## Incidents

### 2026-06-18 — Vercel ENOENT marketing client-reference manifest

| Field | Detail |
|-------|--------|
| **Issue** | Vercel deploy failed: missing `(marketing)/page_client-reference-manifest.js` |
| **Root cause** | Duplicate homepage routes — `app/page.tsx` and `app/(marketing)/page.tsx` both resolved to `/`. Next.js wrote NFT trace referencing a manifest that was never emitted for the marketing page. |
| **Fix** | Removed duplicate `app/page.tsx`; marketing home is sole `/` route under `(marketing)/layout.tsx`. |
| **Affected modules** | `app/(marketing)/page.tsx`, Vercel deploy pipeline |
| **Resolution** | Local and Vercel builds pass; Phase 431 governance now blocks duplicate homepage routes |

### 2026-06-20 — Vercel webpack compile OOM on Turbo (60 GB)

| Field | Detail |
|-------|--------|
| **Issue** | Repeated Vercel deploy failures: webpack compile OOM at ~14 GB heap despite Turbo 60 GB build machine |
| **Root cause** | Production scripts force `--webpack` (Next 16 defaults to Turbopack). Split compile phase was capped at `14336` MB (Enhanced 16 GB tuning from commit `3f6c316`). Prior “48 GB” attempt used global `NODE_OPTIONS` + monolithic build (`AIPIFY_SPLIT_BUILD=0`) on Enhanced 16 GB — unallocatable. Heap bumps never reached the compile child with a Turbo-sized limit. |
| **Fix** | Keep split compile/generate; set `AIPIFY_BUILD_HEAP_COMPILE=--max-old-space-size=40960` for Turbo (40 GB JS heap, ~20 GB native headroom on 60 GB); log machine context + heap at each phase in `build-split.mjs`; webpack `parallelism: 1`; no global `NODE_OPTIONS`. Turbopack path reserved via `AIPIFY_USE_TURBOPACK=1` after barrel import fixes. |
| **Affected modules** | `scripts/build-split.mjs`, `scripts/build-with-duration.mjs`, `vercel.json`, `next.config.ts`, `docs/BUILD_MEMORY.md` |
| **Resolution** | Compile child receives 40 GB heap on Turbo; generate 16 GB in a fresh process |

### 2026-06-20 — Vercel native OOM Worklist::Segment at 40 GB JS heap (caab7e3)

| Field | Detail |
|-------|--------|
| **Issue** | Compile failed after ~11.4 min: `Fatal process out of memory: Worklist::Segment::Create` despite `verified heap_size_limit_mb=41152` on Turbo 60 GB |
| **Root cause** | 40 GB JS heap + V8/webpack native parallel compile memory (Worklist segments) exceeded 60 GB physical RAM before JS heap limit was reached |
| **Fix** | Lower compile heap to **30720 MB** (30 GB); keep generate at 16384 MB; auto-cap Turbo compile to `physical_ram - 30720`; `UV_THREADPOOL_SIZE=4` on compile child; `enablePrerenderSourceMaps: false` in `next.config.ts`. Barrel export fix (`def8defd`) already on main. |
| **Affected modules** | `vercel.json`, `scripts/build-split.mjs`, `scripts/build-with-duration.mjs`, `next.config.ts`, `docs/BUILD_MEMORY.md` |
| **Resolution** | ~30 GB native headroom for Worklist + OS; watch `native_headroom_mb` in Vercel logs |
| **Fallback** | Monolithic `AIPIFY_SPLIT_BUILD=0` at 30720 MB on Turbo if split compile still OOMs |

### 2026-06-20 — Vercel webpack compile OOM at ~15 GB despite 40960 config (8225f02a)

| Field | Detail |
|-------|--------|
| **Issue** | Turbo 60 GB build failed during Compile: `GC: 15123.9 MB heap → FATAL ERROR: NewSpace::EnsureCurrentCapacity` while logs showed `configured_heap_mb=40960` |
| **Root cause** | `build-split.mjs` used `npx next build` with `NODE_OPTIONS=--max-old-space-size=40960`. npm/npx spawns wrapper processes; the heap flag never reached the actual Next.js/webpack Node process (~15 GB ≈ V8 default on high-RAM hosts). |
| **Fix** | Invoke Next directly: `node --max-old-space-size=40960 ./node_modules/next/dist/bin/next build --webpack …`; log `v8.getHeapStatistics().heap_size_limit` before each compile/generate phase; strip inherited `NODE_OPTIONS` from child env. |
| **Affected modules** | `scripts/build-split.mjs`, `scripts/build-with-duration.mjs`, `docs/BUILD_MEMORY.md` |
| **Resolution** | Verified heap limit matches requested MB in Vercel logs before webpack compile runs |

### 2026-06-20 — Vercel Static generation OOM after split compile (8192 MB)

| Field | Detail |
|-------|--------|
| **Issue** | Deploy failed after compile succeeded (`configured_heap_mb=49152`); monolithic retry on 217194c OOM'd on Standard 8 GB |
| **Root cause** | Split generate phase capped at `8192` MB (d14b7456); static generation + trace collection exceeded heap. Commit 217194c regressed to monolithic `AIPIFY_SPLIT_BUILD=0` + global `NODE_OPTIONS=49152`, which OOM'd on Standard build machines (`VERCEL_BUILD_MACHINE_TYPE` in `vercel.json` is not honored — configure Turbo/Enhanced in Vercel dashboard). |
| **Fix** | Restore split build; `AIPIFY_BUILD_HEAP_COMPILE=40960`, `AIPIFY_BUILD_HEAP_GENERATE=16384`; auto-cap heaps to physical RAM in `build-split.mjs`; no global `NODE_OPTIONS`. |
| **Affected modules** | `vercel.json`, `scripts/build-split.mjs`, `docs/BUILD_MEMORY.md` |
| **Resolution** | Generate runs in fresh 16 GB process after compile exits; compile capped at 40 GB for native headroom on Turbo 60 GB |

### 2026-06-20 — Vercel native OOM during webpack compile (Worklist::Segment)

| Field | Detail |
|-------|--------|
| **Issue** | Compile failed after ~9.4 min: `Fatal process out of memory: Worklist::Segment::Create` with `configured_heap_mb=49152` on Turbo 60 GB |
| **Root cause** | 49 GB `--max-old-space-size` + webpack native allocations + V8 parallel job memory exceeded 60 GB physical RAM before JS heap limit |
| **Fix** | Reduce compile heap to 40960 MB; bump generate to 16384 MB; log total RAM / native headroom; set webpack `parallelism: 1` |
| **Affected modules** | `vercel.json`, `scripts/build-split.mjs`, `next.config.ts` |

### 2026-06-19 — Vercel OOM during duplicate TypeScript check

| Field | Detail |
|-------|--------|
| **Issue** | Vercel deploy failed after “Compiled successfully”; build report showed OOM during “Running TypeScript …” |
| **Root cause** | `validate:deployment` already runs `tsc --noEmit`; Next.js ran a second full typecheck and exhausted 16 GB Enhanced build RAM |
| **Fix** | `typescript.ignoreBuildErrors: true` in `next.config.ts` — types still gated by `validate:deployment` |
| **Affected modules** | `next.config.ts`, Vercel build pipeline |
| **Resolution** | Single typecheck before compile; import warning for consolidated catch-all allowlisted |

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
AIPIFY_BUILD_HEAP_COMPILE="--max-old-space-size=30720" AIPIFY_BUILD_HEAP_GENERATE="--max-old-space-size=16384" npm run build
```

Quick heap verification (no compile):

```bash
AIPIFY_BUILD_HEAP_COMPILE="--max-old-space-size=30720" node scripts/build-split.mjs --from 4
```

Expect log lines: `verified heap_size_limit_mb=30720` and `native_headroom_mb=30720` on a 60 GB host.

### Monolithic fallback (Turbo 60 GB only)

If split compile still hits native OOM (`Worklist::Segment::Create`) at any heap size, try monolithic with barrel fixes on main (`def8defd`):

```bash
AIPIFY_SPLIT_BUILD=0 AIPIFY_BUILD_HEAP_COMPILE="--max-old-space-size=30720" npm run build
```

Set in Vercel → `vercel.json` `build.env`: `AIPIFY_SPLIT_BUILD=0` (remove or unset split-only vars). Agent `f4b95e81` reported local PASS with monolithic + barrel fixes. Prefer split when stable — monolithic peak RAM is higher but avoids split-phase artifact edge cases.
