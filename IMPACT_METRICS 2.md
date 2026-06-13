# Aipify Anonymised Impact Metrics & Marketing Proof

**Phase 21 · Version 1.0 · Critical**

Prove operational value across tenants without storing sensitive customer business data.

**Prerequisites:** [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) · [LICENSE_CENTER.md](./LICENSE_CENTER.md) · [CORE_FOUNDATION.md](./CORE_FOUNDATION.md)

**Code:** `lib/impact/` · Platform route: `/platform/impact` · Install API: `/api/install/metric-event`

---

## Layer ownership

| Surface | Layer | Justification |
|---------|-------|---------------|
| Global Impact Dashboard | **Platform Admin** | Cross-tenant aggregates for Aipify Group only |
| Marketing proof export | **Platform Admin** | Safe public statements from anonymised totals |
| Trust Center disclosure | **Customer App** | Transparency for tenant users at `/app/license` |
| Metric event ingestion | **Install Engine** | Installations report counts via installation token |

Shared constants live in `lib/impact/`. No duplication of business logic across layers.

---

## 1. Core principle

Customer business data stays with the customer.

Aipify may collect **anonymised operational outcome metrics** — proof of value, not private business data.

---

## 2. Allowed metrics

Counts and outcome trends only:

- Support cases resolved / escalated
- Response and resolution time improvements (minutes)
- Automated actions completed / failures prevented
- Self-healing runs, integration issues detected/repaired
- Emails drafted (not content)
- Recommendations generated / approved / rejected
- Time saved estimates
- Customer satisfaction scores (numeric only)
- System health events, update success, install health score

---

## 3. Forbidden data

Never store for marketing metrics:

- Customer names, email/chat content, order details, sales figures
- Product names, inventory quantities, payment/transaction data
- Personal identifiers or sensitive business records

Enforced in `lib/impact/privacy.ts` and DB schema (no content fields).

---

## 4. Data model

Table: `anonymised_metric_events`

- `tenant_id`, `installation_id`, `event_type`, `event_category`
- `event_count`, `risk_level`, `source_module`
- `year`, `month`, `anonymised = true`
- No private content columns

Audit: `impact_audit_log` — aggregation, export, download, public approval.

---

## 5. Minimum group size

Public marketing requires **≥ 5 tenants** in the aggregate period.

Below threshold: **internal-only** statements (`usage: internal_only`).

---

## 6. RPCs

| RPC | Access |
|-----|--------|
| `record_anonymised_metric_event` | Authenticated (tenant-scoped callers) |
| `record_install_metric_event` | Install token (anon) |
| `get_customer_impact_summary` | Customer App (own tenant) |
| `get_platform_impact_dashboard` | Platform Admin |
| `generate_marketing_proof_statements` | Platform Admin |
| `record_impact_audit_event` | Platform Admin |

---

## 7. Routes

- **Platform Admin:** `/platform/impact` — global dashboard + marketing proof
- **Install Engine:** `POST /api/install/metric-event`
- **Platform API:** `GET/POST /api/platform/impact/marketing-proof`
- **Customer App:** Trust & License Center → `anonymised_impact` section

---

## Final principle

Aipify can say: *"We helped businesses resolve millions of operational tasks."*

Without exposing who end customers were, what they bought, what they wrote, or private business data.
