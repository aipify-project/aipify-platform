# Public legacy URL matrix — AIPIFY_PUBLIC_SUPPORT_FINAL_POLISH_AND_LEGACY_CLEANUP_V1

**Status:** Recommendation for separate owner YES before destructive decommission.  
No physical deletion of route groups or authenticated `/partners` portal in this job.

## Approved active (Kompis Web sales chrome)

| URL | Action | Notes |
|---|---|---|
| `/` | **Keep** | Indexable sales home |
| `/start` | **Keep** | Workspace establish |
| `/privacy` · `/terms` | **Keep** | Legal |
| `/contact/support` | **Keep** | Public support intake (LIVE) |
| `/growth-partners` | **Keep** | Moved to `(kompis-sales)` chrome this job |
| `/certified-sales-partner` | **Keep** | Separate CSP apply surface (do not merge with free Growth Partner messaging) |
| `/login` | **Keep** | Auth entry |
| `/s/[code]` | **Keep** | Partner attribution sales page |
| `/p/*` (if mounted) | **Keep** | CSP attribution |
| `/partners/academy/verify/[certificateId]` | **Keep** | Certificate verification |

## Already 301 (see `lib/marketing/public-redirects.ts`)

| From | To |
|---|---|
| `/become-a-partner` · `/sell-aipify` · `/start-selling` | `/growth-partners` |
| `/contact` | `/contact/support` |
| `/kompis-web` · `/book-demo` | `/` |
| `/solutions` | `/customer-stories` |
| `/resources` | `/knowledge` |
| `/business-packs` | `/pricing#business-packs` |

## Legacy marketing shell `(marketing)` — still reachable

These keep serving content for bookmarks but now emit **`noindex, follow`** via `(marketing)/layout` metadata (not robots-disallow).

| URL | Recommended next YES |
|---|---|
| `/product` · `/pricing` · `/enterprise` · `/security` · `/why-aipify` · `/how-aipify-works` · `/companion` · `/modules` · `/install` | **301** → `/#product` or `/#pricing` (locale-preserving) — separate YES |
| `/knowledge` (+ articles) | **Keep temporarily** with noindex **or** migrate to sales FAQ — separate YES |
| `/company` · `/careers` · `/media` · `/investors` · `/customer-stories` · `/pilot` · `/early-access` · `/get-started` | **301** → `/` or dedicated replacement — separate YES |
| `/contact` | Already 301 → `/contact/support` |
| `/growth-partner-terms` | **Keep** until legal replacement confirmed |
| Authenticated `/partners/*` portal | **Out of scope** — not marketing |

## Sitemap / robots (this job)

- `app/sitemap.ts` already lists only approved public surfaces (+ growth-partners, CSP, support).
- `app/robots.ts` allows approved sales paths; does **not** disallow legacy marketing URLs so crawlers can observe noindex.

## Exact decommission list (needs separate YES)

1. Permanent 301 map for obsolete marketing hubs listed above (not blanket-to-home).  
2. Optional removal of unused `(marketing)` page modules after 301 soak.  
3. Decision on Knowledge Center public future.  
4. No deletion of `/partners` portal, `/s/*`, certificate verify, or Website Kompis Public Chain.
