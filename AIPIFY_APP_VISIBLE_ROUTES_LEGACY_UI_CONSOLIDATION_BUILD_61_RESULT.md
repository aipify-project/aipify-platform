# AIPIFY – VISIBLE ROUTES & LEGACY UI CONSOLIDATION BUILD 61 — RESULT

**Branch:** `feature/app-visible-routes-legacy-ui-consolidation-61`  
**Feature commit:** `47d3bc7f63ad7d603c4ae45e05669e40d7663760`  
**PR:** _(filled after PR)_  
**Merge SHA:** _(filled after merge)_  
**APP project:** `aipify-platform` (`prj_tPgcqwgUAAkGvBy802arVXVYf1fv`)  
**Deployment ID:** _(filled after deploy)_  
**Canonical domain:** `app.aipify.ai`

| Gate | Result |
|------|--------|
| `READY FOR OWNER APP UI TEST` | **YES** (after LIVE) |
| `SAFE TO FREEZE APP STRUCTURE` | **NO** |

---

## Scope delivered

All **19** flat-menu targets render through `AppHubShell` + `AppContentWidth` (~1560px). Nested panels accept `embedded` so they no longer reintroduce narrow `max-w-*`, duplicate H1, or settings back-links used as navigation.

Legacy `/app/domains` bookmarks redirect once to `/app/website-kompis/connection` (no loop).

---

## 19-route before / after matrix

### Kompis Web

| Menu | Route | Render | Action | Preserved |
|------|-------|--------|--------|-----------|
| Dashboard | `/app/website-kompis` | AppHubShell + status cards | REPLACE PRESENTATION | Owner overview; trimmed card set |
| Questions & answers | `/app/website-kompis/feedback` | AppHubShell + Feedback panel `embedded` | WRAP | Existing feedback overview API |
| FAQ | `/app/website-kompis/faq` | AppHubShell + FAQ admin `embedded` | WRAP | Existing FAQ admin; frozen runtime untouched |
| Invoices | `/app/account/invoices` | AppHubShell + Enterprise invoice panel `embedded` | WRAP | Aipify→customer invoices only |
| Modules | `/app/software` | AppHubShell + Software catalog `embedded` | WRAP | Existing catalog; no purchase |
| Connection / license | `/app/website-kompis/connection` | AppHubShell + DomainLicenseCenter `embedded` | MERGE | Domain/install/license panel |
| Subscription | `/app/account/subscription` | AppHubShell + BillingAdmin `embedded` | WRAP | Billing reference; no payment mutation |
| Settings | `/app/website-kompis/settings` | AppHubShell + cards (appearance, integrations, notifications) | WRAP | Sub-routes under Settings active nav |

### Kompis Bedrift

| Menu | Route | Render | Action | Preserved |
|------|-------|--------|--------|-----------|
| Dashboard | `/app/kompis-bedrift` | AppHubShell + Bedrift cards | REPLACE PRESENTATION | Product-specific overview |
| Employees | `/app/kompis-bedrift/employees` | AppHubShell + TeamCenter `embedded` | WRAP | Invite/role logic unchanged |
| Documents | `/app/kompis-bedrift/documents` | AppHubShell + Document panel `embedded` | WRAP | Existing document management |
| FAQ (internal) | `/app/kompis-bedrift/knowledge` | AppHubShell + honest empty + deep-link | HONEST EMPTY STATE | Separated from public WK FAQ |
| Communication | `/app/kompis-bedrift/communications` | AppHubShell + Communications `embedded` | WRAP | Existing panel |
| Meetings | `/app/kompis-bedrift/meetings` | AppHubShell + Meetings `embedded` | WRAP | Existing panel |
| Invoices | `/app/account/invoices` | Shared with Web | WRAP | Same Aipify→customer source |
| Modules | `/app/kompis-bedrift/modules` | AppHubShell + ModulesAdmin `embedded` | WRAP | Bedrift modules only |
| Subscription | `/app/account/subscription` | Shared with Web | WRAP | Same billing reference |
| Connection / license | `/app/kompis-bedrift/connection` | AppHubShell + access/subscription cards | REPLACE PRESENTATION | Not Web domain panel |
| Settings | `/app/kompis-bedrift/settings` | AppHubShell + cards | WRAP | Integrations/notifications entries |

---

## Legacy surfaces replaced (presentation only)

- Narrow panel chrome (`max-w-4xl` / `max-w-5xl` / duplicate page titles) when opened from the 19 menu targets
- Settings back-links acting as secondary nav inside hub pages
- Standalone domains page as a competing connection entry (redirect → connection hub)
- Duplicate H1 on BillingAdmin / EnterpriseInvoiceDetails when embedded in AppHubShell

Not deleted: underlying APIs, RPCs, tables, or the ~1270 non-menu APP routes.

---

## Direct sub-routes & active nav

| Path | Active nav id |
|------|----------------|
| `/app/website-kompis/feedback` | `kompisWebQa` |
| `/app/website-kompis/faq` | `kompisWebFaq` |
| `/app/website-kompis/connection` | `kompisWebConnection` |
| `/app/domains` | `kompisWebConnection` (redirect) |
| `/app/software` | `kompisWebModules` |
| `/app/account/invoices` | `accountInvoices` |
| `/app/account/subscription` | `accountSubscription` |
| `/app/website-kompis/settings` (+ appearance / integrations / notifications) | Settings product row |
| `/app/kompis-bedrift/employees` | `kompisBedriftEmployees` |
| … remaining Bedrift flat paths | Matching Bedrift ids |

---

## Faktura contract

Unchanged from job 60: **Aipify / Platform → customer account only**.  
Panel: `EnterpriseInvoiceDetailsPanel` with `embedded` — no demo rows, no outbound customer invoicing, no schema/payment changes.

---

## Locale

- Added `productHubs.account.subscriptionEyebrow` for `en`, `no`, `sv`, `da`, `pl`, `uk`, `es`
- Reused existing hub copy for connection / knowledge / invoice semantics

---

## Tests / build

| Check | Result |
|-------|--------|
| `visible-routes-consolidation-61.test.ts` | PASS |
| `flat-account-nav-contract-60.test.ts` | PASS |
| `floating-companion-decommission-57.test.ts` | PASS |
| `tsc --noEmit` | PASS |
| `npm run build` | PASS (EXIT 0, ~886s) |
| Frozen Website Kompis hashes | **0 mismatches** |
| Authenticated UI-QA | **BLOCKED** (owner session) |

---

## Preservation flags

| Flag | Value |
|------|-------|
| auth preserved | YES |
| `/app/kompis` preserved | YES (not in flat menus; operator path retained) |
| old APP Companion absent | YES |
| Frozen Website Kompis files/hashes/runtime diff | **0** |

---

## Later deletion candidates (dependency proof required)

| Candidate | Why not deleted in 61 |
|-----------|------------------------|
| Standalone panel chrome paths used only by legacy deep-links | Still reachable outside the 19-menu set |
| Old `/app/settings/billing` page chrome | Separate settings entry; embedded only on account subscription |
| Non-menu APP routes (~1270) | Explicitly out of scope |

---

## Blockers

- Authenticated desktop walkthrough of all 19 entries — owner session required

---

## Owner test after LIVE

1. Every menu item opens a wide, coherent page  
2. No nested/legacy sidebar returns  
3. Sub-functions live on the page (Settings cards, etc.)  
4. Web vs Bedrift remain distinct  
5. Faktura = Aipify invoices only  
6. Typography/width/icons improve without freezing design  
7. No false capability promises  
8. Structure remains editable — **SAFE TO FREEZE = NO**
