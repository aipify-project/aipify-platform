# Commercial Packages & Modular Architecture

**Phase 42 · Product strategy implementation**

Defines how Aipify is packaged, licensed, sold, and expanded as a modular SaaS platform.

**Prerequisites:** [LICENSE_CENTER.md](./LICENSE_CENTER.md) · [SKILL_ENGINE.md](./SKILL_ENGINE.md) · [BUSINESS_DNA_ENGINE.md](./BUSINESS_DNA_ENGINE.md)

**Code:** `lib/commercial-packages/` · migration `20260613000000_commercial_packages_phase42.sql`

**Pricing philosophy:** [AIPIFY_ENTERPRISE_PRICING_PHILOSOPHY_COMMERCIAL_MODEL.md](./AIPIFY_ENTERPRISE_PRICING_PHILOSOPHY_COMMERCIAL_MODEL.md) — value-based ABOS pricing guidance (not token/chatbot metering); `lib/commercial-packages/pricing-philosophy.ts`; migration `20261114000000_enterprise_pricing_philosophy_commercial_model.sql`; `enterprise_pricing_philosophy` block in `get_customer_billing_center()` (owner/admin).

---

## Vision

From a collection of features → a **modular AI platform** where customers pay only for what they need and grow naturally across packages.

---

## Route mapping

| Spec | Aipify route |
|------|----------------|
| `/admin/billing` | `/app/settings/billing` |
| `/admin/modules` | `/app/settings/modules` |

---

## Product structure

```
Aipify Core → Support Suite → Operations Suite → Knowledge Suite → Insights Suite → Enterprise Intelligence
```

---

## Packages

| Package | Maps to plan | Target |
|---------|--------------|--------|
| Starter | `starter` | Small businesses, solo entrepreneurs |
| Professional | `growth` | Growing SMBs, support automation |
| Business | `business` | Teams with internal processes (EKE) |
| Insights | add-on | Operational intelligence |
| Enterprise | `enterprise` | Large orgs, governance, SLA |

---

## Database tables

| Table | Purpose |
|-------|---------|
| `subscription_packages` | Commercial package catalog |
| `tenant_modules` | Per-tenant module licensing and flags |
| `tenant_usage_metrics` | Monthly usage rollup |

Integrates with existing `plans` and `subscriptions` tables.

---

## Feature flag states

`enabled` · `disabled` · `trial` · `beta` · `deprecated` · `enterprise_only`

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/commercial-packages/billing` | GET |
| `/api/commercial-packages/modules` | GET, PATCH |

---

## Key RPCs

- `get_customer_billing_center()` — package, usage, upgrades, add-ons
- `get_customer_modules_center()` — installed/available modules, recommendations
- `is_tenant_module_enabled()` — module gate for features
- `update_tenant_module()` — admin enable/disable
- `track_tenant_usage()` — usage metrics
- `sync_tenant_modules_from_package()` — license sync from subscription
- `get_upgrade_recommendations()` — natural upgrade path
- `get_platform_commercial_packages_overview()` — aggregates only

---

## i18n

`customerApp.commercialPackages.*` · `platform.commercialPackages.*` (en/no/sv/da)
