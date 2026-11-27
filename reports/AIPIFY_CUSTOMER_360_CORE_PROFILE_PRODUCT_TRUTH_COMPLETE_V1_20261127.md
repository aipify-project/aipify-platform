# Customer 360 · Core Profile · Product Truth V1

**Date:** 2026-11-27  
**Branch:** `fix/customer-360-core-profile-product-truth-v1-20261127`  
**Feature owners:** PLATFORM ADMIN + CUSTOMER APP  
**SQL / Production Core writes:** fail-closed until exact owner YES

## Field matrix (authoritative)

| FIELD | AUTHORITATIVE CORE SOURCE | APP READ | PLATFORM READ | PLATFORM WRITE | AUTHORIZATION | CURRENT GATE |
|-------|---------------------------|----------|---------------|----------------|---------------|--------------|
| Person full name | `customers.full_name` (+ `users.full_name` via APP sync) | Yes | Yes (primary contact) | API → RPC candidate | Platform admin + reason | **CORE_GATE_PENDING** (RPC SQL) · APP PATCH live |
| Person phone E.164 | `customers.phone` (+ auth phone via APP sync) | Yes | Yes | API → RPC candidate | Platform admin + reason | **CORE_GATE_PENDING** (RPC SQL) · APP PATCH live |
| Contact email | `customers.email` | Locked | Identity panel | Existing identity RPC | Super Admin high-risk | LIVE |
| Login email | `auth.users.email` | Locked | Technical / identity | Auth flows only | — | No Platform shortcut |
| Legal / org name | `customers` / companies | Read-only | Firma tab | No (high-risk) | — | Request change → Support |
| Org number | `customers.organization_number` | Read-only | Firma tab | No (high-risk) | — | Request change → Support |
| Person / company address | Not owned in Core profile today | Not registered | Not registered | — | — | SQL future · no fake fields |
| APP license | `licenses` / commercial | Relationship tab | Produkter | Provision panels | Platform admin | LIVE |
| Website Kompis | `get_platform_portal_customer_website_kompis_status` | — | Produkter | Activation panel | Platform admin | LIVE (separate from APP) |
| Kompis Bedrift | Entitlement / Bedrift status RPC | — | Produkter | Never from APP membership | Platform admin | LIVE truth helper |
| Modules metric | `entitlements[]` | — | Control plane | — | — | Empty → **Not available** (not 0/0) |
| Domains / installs | detail domains + usage | — | Produkter / KPIs | Domain panel | Platform admin | LIVE |
| Support cases | usage.openSupportCount | Support requests | Support tab | Link to `/platform/support` | — | LIVE counts |

## Why Website Kompis looked “wrong”

- APP license **active** + Lifetime agreement ≠ Website Kompis activation.
- Website Kompis is site-specific (domain + install + activation RPC).
- Verified website runtime delivery is a separate proof chain.
- Kompis Bedrift is never inferred from APP membership (control-plane fix).
- Modules **0/0** was empty entitlements presented as zeros — now **Not available**.
- “142 activated services” is not entitlement rows; activated-services card is Website Kompis scoped with scope note (not a global service counter).

## Shipped in this PR (CODE)

1. Platform Customer 360 horizontal tabs: Kontakt · Firma · Produkter · Abonnement · Support · Teknisk  
2. Product truth helpers + control-plane modules/Bedrift honesty  
3. APP form card ~720px (`max-w-[45rem]`); phone options without double flag emoji  
4. «Be om endring» → `/app/support/requests?new=1&category=account&intent=customer_profile_change` with prefill  
5. Primary-contact PATCH API fail-closed (`501 core_gate_pending`) until RPC applied  
6. SQL candidate: `docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql`

## Gates

| Status | Item |
|--------|------|
| DONE (code) | Tabs, product truth labels, APP width, Support prefill, fail-closed write API |
| CORE_GATE_PENDING | Apply primary-contact RPC SQL (Staging YES → Prod YES) |
| OWNER_BROWSER_QA_PENDING | Authenticated Platform Customer 360 + APP profile + Support create |

## Tests

- `npx tsx lib/platform-portal/customer-product-truth.test.ts`
- `npx tsx lib/platform-portal/customer-360-tabs.test.ts`
- `npx tsx lib/platform-portal/customer-primary-contact-write.test.ts`
- `npx tsx lib/core/access-control-plane/access-control-plane-62.test.ts`
