# Aipify License & Trust Center

**Phase 20 · Version 1.0 · Critical**

Transparent ownership and licensing framework built directly into the customer experience.

**Prerequisites:** [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) · [UPDATE_ENGINE.md](./UPDATE_ENGINE.md) · [CORE_FOUNDATION.md](./CORE_FOUNDATION.md)

**Code:** `lib/license/` · Route: `/app/license` · Sidebar: `LicenseSidebarPanel`

---

## 1. Purpose

Customers should always know:

- Who built Aipify and who owns the software
- What data is stored and what is not stored
- What happens when subscriptions expire
- What rights and obligations apply

**Final principle:** Aipify should never hide how it works. Trust grows through transparency.

---

## 2. Sidebar license panel

Non-intrusive footer in the customer sidebar displays:

- Powered by Aipify™
- Licensed to: [Company Name]
- Subscription: [Plan Name]
- Status: Active / Grace period / Paused
- Version: vX.X.X
- © Aipify Group AS

Clicking opens **Trust & License Center** at `/app/license`.

---

## 3. Trust & License Center sections

| Section | Content |
|---------|---------|
| License Information | Usage license tied to plan and domains |
| Software Ownership | Proprietary software — license, not ownership |
| Subscription Status | Plan, renewal, counts, payment status |
| Data Ownership | Customer retains business data control |
| Security Principles | No employee monitoring; transparent permissions |
| Update Policy | Advance notice; critical security exceptions |
| Payment Policy | 3-day grace period; pause without data deletion |
| Contact Information | Website, support, privacy contacts |
| Legal Information | Software owner and legal contacts |
| Anti-Tampering | Supported interfaces only |
| Enterprise | Custom agreements and hosted intelligence |

---

## 4. Payment & pause policy

**Grace period:** 3 calendar days (`PAYMENT_GRACE_PERIOD_DAYS`)

| Phase | Behavior |
|-------|----------|
| Grace period | Warnings shown; full access continues |
| After grace | Services paused; configuration preserved |
| Reactivation | Automatic on successful payment |

**Paused — disabled:** active assistance, briefings, recommendations, new actions, heartbeat processing

**Paused — allowed:** billing, License Center, payment recovery

**Customer data protection:** settings, recommendations, preferences, installations, and approval policies are **not** deleted during pause.

---

## 5. Software version

Platform version constant: `AIPIFY_PLATFORM_VERSION` in `lib/license/engine.ts` (currently `1.0.0`).

Per-installation versions tracked separately via Update Engine.

---

## 6. Database & RPCs

Migration: `20260610700000_license_center_phase20.sql`

- `subscriptions.license_service_status` — `active` · `grace_period` · `paused`
- `resolve_license_service_status(customer_id)`
- `get_customer_license_center()` — sidebar + center data
- `assert_license_capacity` — blocks operations when paused

---

## 7. Architecture placement

| Layer | Path |
|-------|------|
| Customer sidebar | `components/app/license/LicenseSidebarPanel.tsx` |
| Trust Center page | `app/app/license/`, `app/dashboard/license/` |
| Constants & policy | `lib/license/` |
| Labels | `lib/app/license-labels.ts` |

---

## 8. Success criteria

- Customers understand who owns Aipify
- Customers understand what is and is not stored
- License status is transparent in sidebar and center
- Payment recovery is predictable (grace → pause → reactivate)
- Trust increases through built-in clarity
