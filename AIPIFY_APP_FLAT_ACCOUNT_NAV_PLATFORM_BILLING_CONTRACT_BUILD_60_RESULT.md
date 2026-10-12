# AIPIFY – FLAT ACCOUNT NAVIGATION & PLATFORM BILLING CONTRACT BUILD 60 — RESULT

**Branch:** `feature/app-flat-account-nav-billing-contract-60`  
**PR:** _(filled after open)_  
**Merge SHA:** _(filled after merge)_  
**APP project:** `aipify-platform` (`prj_tPgcqwgUAAkGvBy802arVXVYf1fv`)  
**Deployment ID:** _(filled after deploy)_  
**Canonical domain:** `app.aipify.ai`

| Gate | Result |
|------|--------|
| `READY FOR OWNER APP UI TEST` | **YES** (after LIVE) |
| `SAFE TO FREEZE APP STRUCTURE` | **NO** |

---

## Account / product context model (proven)

| Concept | Source in repo (no new SQL) |
|---------|-----------------------------|
| Organization / workspace | `get_app_organization_context` + `OrganizationSwitcher` |
| Active product | Cookie `aipify_app_product_context` + pathname infer + capability allowlist |
| Entitlement gate (Web) | `website_kompis` / `__website_kompis_denied__` via Core menu capability |
| Bedrift | Capability-visible Bedrift ids (fail-open when entitled by role) |
| Shared Faktura / Abonnement | Same account routes from both product menus |

No Core `active_product` column. Presentation-only context switcher.

---

## Before / after navigation

| Before (58–59) | After (60) |
|----------------|------------|
| Three accordion groups: Web / Bedrift / Account | One flat vertical list for the active product |
| Both product menus visible together | Exactly one product menu |
| Integrations / Notifications as Account sidebar rows | Settings page cards only |
| Connection mixed with access copy | Connection/license as distinct primary row vs Subscription |

### Kompis Web (exact)

1. Dashboard → `/app/website-kompis`  
2. Questions and answers → `/app/website-kompis/feedback`  
3. FAQ → `/app/website-kompis/faq`  
4. Invoices → `/app/account/invoices`  
5. Modules → `/app/software`  
6. Connection and license → `/app/website-kompis/connection`  
7. Subscription → `/app/account/subscription`  
8. Settings → `/app/website-kompis/settings`

### Kompis Bedrift (exact)

1. Dashboard → `/app/kompis-bedrift`  
2. Employees → `/app/kompis-bedrift/employees`  
3. Documents → `/app/kompis-bedrift/documents`  
4. FAQ → `/app/kompis-bedrift/knowledge`  
5. Communication → `/app/kompis-bedrift/communications`  
6. Meetings → `/app/kompis-bedrift/meetings`  
7. Invoices → `/app/account/invoices`  
8. Modules → `/app/kompis-bedrift/modules`  
9. Subscription → `/app/account/subscription`  
10. Connection and license → `/app/kompis-bedrift/connection`  
11. Settings → `/app/kompis-bedrift/settings`

---

## Context switcher rules

- Pathname product routes win over cookie.  
- Account routes keep cookie product.  
- Cookie must be in capability allowlist.  
- Else first available product.  
- Switch writes cookie and navigates to that product dashboard.  
- Single product: show context, no switch action required.

---

## Faktura / Abonnement / Tilkobling

| Surface | Meaning | Source |
|---------|---------|--------|
| Faktura | Invoices/receipts **from Aipify to the customer account only** | Existing `EnterpriseInvoiceDetailsPanel` — no demo rows, no customer-outbound invoicing |
| Abonnement | Aipify plan / billing reference | `/app/account/subscription` |
| Tilkobling/lisens | Product connected/activated/valid for this account | Web: domains hub; Bedrift: access + license status from org context |

Confirmed: no customer-generated invoice function; no payment provider / schema changes.

---

## Locale

Keys updated for `en`, `no`, `sv`, `da`, `pl`, `uk`, `es` (`productContext`, connection copy, Aipify invoice semantics, connection/license labels).

---

## Tests / build

- `flat-account-nav-contract-60.test.ts` — PASS  
- foundation-58 regression (companion + freeze) — PASS  
- canonical-nav + app-menu-capability + bypass — PASS  
- floating companion decommission — PASS  
- `tsc --noEmit` — PASS  
- `npm run build` — PASS (EXIT 0, ~919s)  
- Frozen Website Kompis hashes — **0 mismatches**  
- Authenticated UI-QA — **BLOCKED** (owner session)

---

## Preservation flags

| Flag | Value |
|------|-------|
| auth preserved | YES |
| `/app/kompis` preserved | YES (settings card / binding only) |
| old APP Companion absent | YES |
| Frozen Website Kompis files/hashes/runtime diff | **0** |

---

## Later delete list (evidence only — not deleted)

- Accordion/`GroupedSidebar` customer path when no longer referenced  
- `/app/account` overview as primary IA entry (routes kept for bookmarks)  
- Remaining mega-nav readiness ids unused by flat contracts  

---

## Owner LIVE checklist

1. Sidebar is one flat list.  
2. Web-only vs Bedrift-only menus.  
3. Product switcher clear and safe.  
4. Integrations/Notifications under Settings cards.  
5. Faktura = Aipify → customer only.  
6. Connection/license ≠ Subscription.  
7. No floating APP Companion; no Website Kompis regression.

**Do not freeze structure without explicit owner approval.**
