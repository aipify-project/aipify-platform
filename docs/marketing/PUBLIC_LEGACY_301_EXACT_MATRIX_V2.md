# Public legacy 301 exact matrix V2

**Status:** Prepared only — **no new redirects applied** without separate owner YES.  
**Baseline:** `docs/marketing/PUBLIC_LEGACY_URL_MATRIX_V1.md` · live redirects in `lib/marketing/public-redirects.ts`.  
**Freeze:** Website Kompis Public Chain unchanged.

## Already LIVE (do not re-add)

| Source | Destination | File | Reason |
|---|---|---|---|
| `/become-a-partner` · `/sell-aipify` · `/start-selling` | `/growth-partners` | `public-redirects.ts` | Partner apply funnel |
| `/contact` | `/contact/support` | `public-redirects.ts` | Public intake |
| `/kompis-web` · `/book-demo` | `/` | `public-redirects.ts` | Single sales home |
| `/solutions` | `/customer-stories` | `public-redirects.ts` | Legacy hub |
| `/resources` | `/knowledge` | `public-redirects.ts` | Legacy hub |
| `/business-packs` | `/pricing#business-packs` | `public-redirects.ts` | Anchor preserve |

## Proposed YES batch (not applied)

| Source | Destination | Code / status | Reason | Dependencies | Rollback |
|---|---|---|---|---|---|
| `/product` · `/modules` · `/companion` · `/how-aipify-works` · `/why-aipify` | `/#product` | 200 + noindex today | Fold product hubs into sales home section | Sales `#product` anchor stable | Remove redirect rows; keep noindex pages |
| `/pricing` · `/enterprise` | `/#pricing` | 200 + noindex | Pricing on sales home | `#pricing` section | Same |
| `/security` · `/install` | `/` | 200 + noindex | No dedicated public replacement | — | Same |
| `/company` · `/careers` · `/media` · `/investors` · `/pilot` · `/early-access` · `/get-started` · `/customer-stories` | `/` | 200 + noindex | Obsolete marketing shell | Legal pages stay | Same |
| `/knowledge` (+ articles) | **KEEP** temporarily | 200 + noindex | Content decision pending | KC future | Do not 301 until YES |
| `/growth-partner-terms` | **KEEP** | 200 | Legal | Legal replacement | — |

### Locale variants

Public sales uses **one URL + cookie/UI locale** (not `/no/...` path locales). Do **not** invent locale-prefixed 301s. Existing path locales (if any legacy) → same destination without `/locale` prefix.

### Must never redirect / delete without separate YES

`/privacy` · `/terms` · `/growth-partners` · `/contact/support` · `/login` · `/start` · `/s/[code]` · `/p/*` · `/partners/*` (auth portal) · certificate verify · Website Kompis public chain files.

### Diff surface when YES is granted

1. Append rows to `MARKETING_PUBLIC_REDIRECTS` in `lib/marketing/public-redirects.ts`.
2. Optional soak then remove `(marketing)` page modules.
3. Re-verify sitemap remains canonical-only; robots must **not** disallow legacy URLs until noindex has been crawled (noindex ≠ robots-disallow).

### Owner YES sentence

```text
YES APPLY LEGACY 301 BATCH V2 from docs/marketing/PUBLIC_LEGACY_301_EXACT_MATRIX_V2.md
into lib/marketing/public-redirects.ts only; no physical deletion; no freeze edits;
Knowledge Center and growth-partner-terms excluded until separate YES.
```
