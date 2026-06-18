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

## Local build

```bash
NODE_OPTIONS="--max-old-space-size=14336" npm run build
```
