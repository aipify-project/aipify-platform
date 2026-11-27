# Customer 360 — field source matrix V1

Date: 2026-11-27  
Branch: `fix/customer-360-core-profile-product-truth-v1-20261127`

## Mapping rule

`customers` (commercial customer row), `companies` / organization workspace, and `users` / auth identity are **not** the same row. Platform Customer Detail joins them via authorized RPCs. APP account profile writes only person name / phone / avatar through existing APP contracts.

| FIELD | AUTHORITATIVE CORE SOURCE | APP READ | PLATFORM READ | PLATFORM WRITE | AUTHORIZATION | CURRENT GATE |
|---|---|---|---|---|---|---|
| Person full name | `users.full_name` (+ sync to primary contact) | Account personal tab | `primaryContactName` via customer detail / enrich | Via APP user update (person) — not Platform free-text | Tenant membership | LIVE |
| Person phone (E.164) | `users.phone` (+ sync) | Account personal tab | `primaryContactPhone` | Same as APP sync path | Tenant membership | LIVE |
| Profile avatar | Storage + user profile | Account personal tab | Not primary UI | APP avatar API | Tenant membership | LIVE |
| Sign-in email | Auth identity | Read-only | Identity panel (`get_platform_portal_customer_identity`) | High-risk `update_platform_portal_customer_contact_email` | Super Admin high-risk gate | LIVE (high-risk) |
| Operational contact email | Customer / identity contact email | Read-only | Detail + identity | Same high-risk contact-email RPC | Super Admin high-risk gate | LIVE (high-risk) |
| Workspace / display name | Organization / customer name | Company + hero | `customer.name` | No APP write; Platform commercial flows | Platform admin | LIVE read; write via existing commercial paths |
| Legal company name | Customer legal name / registration profile | Company tab read-only | `customer.legalName` | **No ordinary write** — Support ticket → Platform high-risk | High-risk / Core gate | CORE_GATE_PENDING for ordinary Platform edit |
| Organization number | Registration / customer | Company tab read-only | `organizationNumber` | High-risk only | High-risk | CORE_GATE_PENDING ordinary edit |
| Company website / company phone / company address | `organization_registration_profiles` (when present) | Company tab when stored | Detail when present | Candidate: `docs/platform/NOT_APPLIED_company_profile_contact_write_v2.sql` | Owner YES + apply | CORE_GATE_PENDING |
| Invoice address | Billing / invoicing tables when present | Relationship / invoices | Commercial / invoicing panels | Billing-owned — not this job | Billing auth | Not invented here |
| Domains | `customer_domains` / portal detail | Install / domains | Detail domains | Domain installation panel | Platform admin | LIVE |
| Installations | Installation rows | Install surfaces | Detail + runtime delivery | Domain/install panels | Platform admin | LIVE |
| APP license | License rows | Relationship / license | Licenses tab + control plane | License provisioning panel | Platform admin | LIVE |
| Website Kompis activation | `get_platform_portal_customer_website_kompis_status` | Kompis operator / delivery | Products tab (dedicated RPC) | Activation panel when eligible | Platform admin | LIVE |
| Website Kompis Success column | Derived from license **provisioning** in `get_platform_portal_customer_success_overview` | n/a | Success overview (setup signal) | n/a | Platform admin | LIVE read — labeled as setup signal, not activation truth |
| Kompis Bedrift | Entitlement / Bedrift status RPC | Bedrift surfaces | Products aside panel | Never from APP membership | Platform admin | LIVE read; assignment not invented |
| Modules metric | Entitlement rows | Dashboard modules | Control-plane modules | n/a | Platform admin | LIVE — empty entitlements → unavailable (not `0/0`) |
| Open support count | Support request aggregates | Support requests | Detail KPI + Support tab | Ticket write via APP Support create | Tenant / Platform | LIVE |
| Profile change request | `create_app_portal_support_request` | «Be om endring» → `/app/support/requests?new=1&category=account&intent=customer_profile_change` | Platform Support inbox | APP creates ticket | Tenant member | LIVE |

## Website Kompis status conflict (root cause)

Observed Production confusion (APP license active / Unlimited agreement / verified domain vs Success “Website Kompis: not ready”) came from **two different sources**:

1. **Activation truth** — dedicated Website Kompis status RPC on the customer card (domain + install + agreement + entitlement layers).
2. **Success overview setup signal** — simplified `website_kompis_status` derived from license provisioning in the Success overview RPC.

They are intentionally different layers. UI now labels Success as a provisioning setup signal and keeps activation truth on the customer Products tab. Unifying the Success RPC to call the activation status function requires a **SQL migration** (CORE_GATE_PENDING) — candidate not applied in this job.

## Editable fields that are actually operative after this ship

- APP: person name, phone, avatar  
- Platform: existing commercial plan, license provisioning, domain installation, Website Kompis activation (when eligible), high-risk contact email  
- APP → Support: real ticket create with account category + prefill for locked company/legal fields  

Not operative without owner YES: ordinary Platform edit of legal name, org.nr, company address/phone/website (SQL candidates under `docs/platform/NOT_APPLIED_*`).
