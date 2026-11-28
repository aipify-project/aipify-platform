# Public legacy decommission manifest V1

**Status:** Prepared only — **no permanent redirects or file deletion without exact owner YES.**  
Source matrix: `docs/marketing/PUBLIC_LEGACY_URL_MATRIX_V1.md`  
Baseline HEAD: `81848cdc14bcbc60ae01c941f2795eb3047af01a` (#529 LIVE).

Preserve until YES: noindex,follow on `(marketing)` layout · no robots-disallow of noindex URLs · `/partners/*` portal · `/s/[code]` · certificate verify · Website Kompis Public Chain.

---

## A. Keep (active sales / legal / intake)

| URL | Status | Notes |
|---|---|---|
| `/` | Keep · indexable | `(kompis-sales)` |
| `/start` | Keep · noindex | establish workspace |
| `/privacy` · `/terms` | Keep | legal |
| `/contact/support` | Keep · indexable | public intake LIVE |
| `/growth-partners` | Keep · indexable | free Growth Partner apply |
| `/certified-sales-partner` | Keep · indexable | paid CSP — not free GP |
| `/login` | Keep | auth entry |
| `/s/[code]` · `/p/*` | Keep | referral — not SEO landing |
| `/partners/academy/verify/[certificateId]` | Keep | public verify |
| `/growth-partner-terms` | Keep | until legal replacement YES |

## B. Already permanent 301 (live)

| Source | Destination | Issue |
|---|---|---|
| `/become-a-partner` · `/sell-aipify` · `/start-selling` | `/growth-partners` | OK |
| `/contact` | `/contact/support` | OK |
| `/kompis-web` · `/book-demo` | `/` | OK |
| `/solutions` | `/customer-stories` | **points at legacy noindex** — repair candidate |
| `/resources` | `/knowledge` | **points at legacy noindex** — repair candidate |
| `/business-packs` | `/pricing#business-packs` | **points at legacy noindex** — repair candidate |

### Repair candidates (separate YES — not applied)

```text
YES UPDATE MARKETING_PUBLIC_REDIRECTS:
  /solutions → /#product (locale-preserving)
  /resources → /#faq (or keep /knowledge with noindex soak)
  /business-packs → /#pricing
No mass redirect to home for all hubs.
```

## C. Legacy `(marketing)` — noindex,follow (reachable)

| URL | Recommended destination | Dependency |
|---|---|---|
| `/product` | 301 → `/#product` | sales home anchors |
| `/pricing` | 301 → `/#pricing` | Agent 1/2 price truth on sales page |
| `/enterprise` | 301 → `/` or `/#product` | no invent enterprise claims |
| `/security` | 301 → `/#trust` or `/` | trust section if present |
| `/why-aipify` · `/how-aipify-works` · `/companion` · `/modules` · `/install` | 301 → `/#product` | sales home |
| `/knowledge` (+ articles/industry) | Keep noindex **or** migrate FAQ → `/#faq` | content decision |
| `/company` · `/careers` · `/media` · `/investors` | 301 → `/` | no dedicated replacements yet |
| `/customer-stories` · `/pilot` · `/early-access` · `/get-started` | 301 → `/` or `/start` | `/get-started`→`/start` preferred |
| `/book-demo` · `/become-a-partner` · `/sell-aipify` · `/start-selling` · `/contact` | already 301 | — |

### Exact YES for 301 wave (template)

```text
YES PUBLIC LEGACY 301 WAVE 1 for paths listed in
docs/marketing/PUBLIC_LEGACY_DECOMMISSION_MANIFEST_V1.md section C
on aipify-platform Production deploy only.
Keep noindex until 301 live. No file deletion. No /partners portal change.
No Website Kompis Public Chain edits.
```

### Later YES (optional)

```text
YES DELETE unused app/(marketing)/page modules after 301 soak ≥ 30 days
excluding growth-partner-terms until legal YES.
```

## D. Out of scope

Authenticated `/partners/*` · Platform/APP/Super · freeze-protected Kompis public chain · support@/partners@ reintroduction.
