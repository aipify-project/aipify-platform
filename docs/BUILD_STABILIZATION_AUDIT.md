# Build Stabilization Audit — 2026-06-20

Branch: `build/stabilization-354a24e` (from `354a24e8`)

## Executive summary

**Root cause:** Production scripts force `--webpack` while the repository (~3601 routes, ~2004 API handlers) exceeds webpack compile memory on Vercel even with Turbo 60 GB and verified 30–40 GB JS heap. Failures: `Worklist::Segment::Create`, `VirtualAddressSubspace::FreePages`, Mark-Compact OOM.

**Not root cause:** Phase 617/618 code (typecheck + imports pass; phase routes add ~17 pages total).

**Fix:** Use Next.js 16 default **Turbopack** for production (`AIPIFY_USE_TURBOPACK=1`). Local turbopack production build **passed** in ~3 min (exit 0).

---

## 1. Forced webpack sources

| Location | Mechanism |
|----------|-----------|
| `package.json` | `build:next`, `build:compile`, `build:generate`, `dev` all pass `--webpack` |
| `scripts/build-split.mjs` | `bundlerFlag = useTurbopack ? "--turbo" : "--webpack"` — default webpack unless `AIPIFY_USE_TURBOPACK=1` |
| `scripts/build-with-duration.mjs` | Monolithic path hardcodes `"build", "--webpack"` |
| `next.config.ts` | `webpack()` hook with `IgnorePlugin` for `locales/**/*.json` — **webpack-only**; runtime locale loading unchanged under Turbopack |

## 2. Split build behavior

Split build separates **compile** and **generate** phases; it does **not** split the webpack module graph. Each phase still runs a full bundler compile for its mode. Split reduces peak by freeing compile heap before generate, but webpack compile alone OOMs on this graph.

## 3. Heap / CPU / worker settings

| Setting | Where | Value | Purpose |
|---------|-------|-------|---------|
| `AIPIFY_BUILD_HEAP_COMPILE` | vercel.json | was 30720 | Direct `node --max-old-space-size=…` on Next binary |
| `AIPIFY_SPLIT_BUILD` | vercel.json | 1 | compile → generate separate processes |
| `experimental.cpus` | next.config.ts | 1 | Limit parallel page compilation |
| `config.parallelism` | next.config.ts webpack | 1 | Limit webpack parallelism |
| `webpackBuildWorker` | next.config.ts | false | Avoid worker IPC V8 max string length on huge graphs |

**Policy:** Do not increase heap further. Turbopack avoids webpack native memory path.

## 4. Route inventory (354a24e)

| Metric | Count |
|--------|------:|
| Total routes | 3601 |
| API routes | 2004 |
| Page routes | 1597 |
| Dynamic routes | 340 |
| Customer app pages | 1241 |
| Platform pages | 189 |

**Largest families:** `api/aipify/aipify-hosts` (104), `api/aipify/business-packs` (45), many `api/aipify/*` modules (918 total under `aipify` API prefix).

**Phase 616/617/618 route additions:** ~6 + ~11 + ~6 = **~23 routes** (not the primary graph inflation).

## 5. Cache-free redeploy

User reported `Restored build cache` on failing builds. Cache is **not** the root cause — same OOM occurs on clean compiles with verified heap. One cache-free redeploy recommended for confirmation only.

## 6. Turbopack production test (local)

```bash
rm -rf .next
node --max-old-space-size=16384 node_modules/next/dist/bin/next build --turbo
```

- **Result:** PASS — Compiled in ~2.5 min, static generation 1906 pages
- **Warnings:** 4 (build-governance import-graph broad glob — non-blocking)
- **Errors:** 0

## 7. Webpack custom incompatibilities (Turbopack)

- `webpack.IgnorePlugin` for locales — not needed for Turbopack; locales loaded via fs at runtime
- `config.cache = false`, `parallelism = 1` — webpack-only

## 8. Phase preservation

Phase 617 and 618 source preserved. No reverts. No new phase features.
