# Customer 360 — field source map (V1)

| FIELD | AUTHORITATIVE CORE SOURCE | APP READ | PLATFORM READ | PLATFORM WRITE | AUTHORIZATION | CURRENT GATE |
|---|---|---|---|---|---|---|
| Person full name | `users.full_name` (+ `customers.full_name` sync for owner/admin) | `/api/app/account-profile` PATCH + load | `get_platform_portal_customer_detail` + enrich `customers.full_name` | PATCH `/api/platform-portal/customers/[id]/primary-contact` | Platform admin; APP owner/admin for self | **OPERATIVE** (existing columns) |
| Phone (E.164) | `auth.users.phone` / metadata; Platform `customers.phone` | APP PATCH | enrich `customers.phone` | primary-contact PATCH | Platform admin; APP self | **OPERATIVE** |
| Avatar | `auth.user_metadata.avatar_url` | `/api/app/account-profile/avatar` | n/a | APP only | Authenticated user | **OPERATIVE** |
| Login email | `auth.users.email` | Locked read | Identity panel (not login mutate) | Auth verification flow only | User / high-risk | Locked in APP |
| Operational contact email | `customers.email` | Locked | Identity + detail enrich | `update_platform_portal_customer_contact_email` | Platform high-risk + confirmation | **OPERATIVE** (high-risk) |
| Invoice contact | `billing_profiles.billing_email` | unavailable | not in detail RPC yet | none | — | **CORE_GATE** (read enrich candidate) |
| Org / legal name | `customers` / companies via detail RPC | workspace name (not legal edit) | detail `name` / `legalName` | none (high-risk future) | — | Read-only; SQL for legal write |
| Org number | `customers.organization_number` | locked | detail | none | — | Read-only |
| Country | `customers.country` | unavailable in APP profile | not surfaced in 360 tabs yet | none | — | Partial |
| Company website/phone/address | `organization_registration_profiles` (candidate) | unavailable | unavailable | `NOT_APPLIED_company_profile_contact_write_v2.sql` | owner/admin | **CORE_GATE_PENDING** |
| Postal / invoice address | `billing_profiles` | unavailable | unavailable in detail | none | — | **CORE_GATE_PENDING** |
| APP license status | licenses + org context | `get_app_organization_context` | detail `licenses` / commercial | license provisioning panels | Platform admin | **OPERATIVE** |
| Plan / lifetime | `subscriptions` / commercial block | billing + relationship tab | detail commercial | commercial plan panel | Platform admin | **OPERATIVE** |
| Website Kompis entitlement/setup/domain/install | `get_platform_portal_customer_website_kompis_status` | Mine produkter / license (separate) | WK status card | activate RPC (existing) | Platform admin | **OPERATIVE** (honest layers) |
| Kompis Bedrift | bedrift status RPC / entitlements | separate | Bedrift panel | activate (existing) | Platform admin | **OPERATIVE** — never from APP membership |
| Modules count | `detail.entitlements` | n/a | control-plane metric | n/a | — | Empty → **Not available** (not 0/0) |
| “Activated services” / 142 | Was misread entitlement/registry counts | — | Renamed semantics via product truth note | — | — | Presentation fix; no fake activation count |

## Support «Be om endring»

- Href: `/app/support/requests?new=1&category=account&intent=customer_profile_change`
- Creates via live `create_app_portal_support_request` (tenant-scoped)
- Prefills account category + localized title/description

## SQL still pending (owner YES)

1. `docs/platform/NOT_APPLIED_company_profile_contact_write_v2.sql` — company website/phone  
2. `docs/platform/NOT_APPLIED_company_profile_read_v2.sql` — APP/Platform address read  
3. `docs/platform/sql-candidates/NOT_APPLIED_platform_customer_primary_contact_write_v1.sql` — optional definer RPC (CODE already writes with audit)
