# Aipify Trust Architecture & Data Ownership

**Phase 19 · Version 1.0 · Critical**

Security, privacy, and data ownership principles before enterprise rollout. Businesses must trust Aipify with operations **without** Aipify taking ownership of sensitive business data.

**Prerequisites:** [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) · [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [INSTALL_ENGINE.md](./INSTALL_ENGINE.md) · [UPDATE_ENGINE.md](./UPDATE_ENGINE.md)

**Code:** `lib/trust/` · Customer Security Dashboard: Settings → Security · Platform: `/platform/trust`

---

## 1. Core principle

**The customer owns the data. Aipify owns the intelligence layer.**

Aipify stores only what is necessary to operate safely. If data is not required — do not store it.

```
Customer Systems → Aipify Connectors → Operational Analysis → Aipify Intelligence Layer
```

Customer systems remain the source of truth.

---

## 2. What Aipify stores vs must not store

**Allowed** (`ALLOWED_STORAGE_CATEGORIES` in `lib/trust/storage.ts`):

Tenant info · installation metadata · subscription status · skill config · presence/executive preferences · recommendations · learning patterns · audit logs · health scores · action/update history · notification preferences · approval policies

**Prohibited by default** (`PROHIBITED_STORAGE_CATEGORIES`):

Full customer databases · emails · conversations · attachments · product catalogs · inventory · payment/card data · payroll · HR records · government IDs · complete transaction histories

Enterprise agreements may override explicitly — never by default.

---

## 3. Metadata-first design (§6)

Store patterns and outcomes, not raw customer records.

| Do not store | Store instead |
|--------------|---------------|
| Order #91827 | Refund activity increase detected |
| Customer name | Trend: refunds +18% |
| Shipping address | Recommendation generated |

---

## 4. Data access levels

| Level | ID | Default | Examples |
|-------|-----|---------|----------|
| 1 | `metadata` | ✓ | System health, support volumes, automation outcomes |
| 2 | `read_only_operational` | Approval | Order counts, inventory trends, performance metrics |
| 3 | `approved_operational_actions` | Approval + policy | Send emails, retry integrations, update workflows |
| 4 | `customer_hosted_intelligence` | Enterprise | Intelligence runs in customer infrastructure |

**Read-only first:** new integrations default to read-only (`DEFAULT_CONNECTOR_PERMISSION`).

---

## 5. Enterprise security models

`cloud_intelligence` → `hybrid_intelligence` → `customer_hosted_intelligence`

For regulated industries (energy, healthcare, government, finance), customer-hosted deployments retain full operational data ownership.

---

## 6. Installation & domain security (§11–12)

Every embedded request must validate:

- Tenant ID · Installation ID · Installation Token
- Registered domains · Subscription status · Permission scope

**Code:** `validateInstallationSecurity()`, `isDomainAuthorized()` in `lib/trust/installation.ts` · `validateEmbedSecurityContext()` in `lib/embed/validation.ts`

Unauthorized domains are rejected automatically.

---

## 7. Approval & permission expansion (§14)

Aipify may **never** expand permissions automatically.

- Read-only cannot become write without approval
- Additional integrations require approval
- Expanded scopes require approval

---

## 8. Immutable audit logging (§15)

Every sensitive operation logs: timestamp · tenant · user · skill · action · reason · approval source · outcome.

Table: `trust_audit_events` · RPC: `record_trust_audit_event` · **immutable** (no updates/deletes)

---

## 9. Customer transparency & Security Dashboard (§16–17)

Customers must understand: what Aipify accesses · why · what is stored · what is not stored · how to revoke.

**Settings → Security** (`/app/settings/security`):

- Connected systems & permission scopes
- Registered domains & token health
- Recent actions & approval history
- Data ownership principles

RPC: `get_customer_security_overview()`

---

## 10. Platform responsibilities (§18)

Platform Admin manages: installation status · subscription validity · skill availability · update schedules · global learning governance.

Platform Admin must **never** browse customer operational data unnecessarily.

RPC: `get_platform_trust_governance()` · UI: `/platform/trust`

---

## 11. Learning restrictions (§19)

Global learning may only use **anonymized operational metadata**.

Never: customer identities · communications · sensitive business records.

**Code:** `lib/trust/learning.ts` · aligns with `PROHIBITED_LEARNING_SOURCES` in `lib/core/foundation.ts`

---

## 12. Offboarding (§20)

On subscription end: disable installations → invalidate tokens → terminate connectors → retain only legally required records.

Customer operational data remains with the customer.

**Code:** `OFFBOARDING_SEQUENCE` in `lib/trust/offboarding.ts`

---

## 13. Privacy by design (§21)

Before every feature, answer:

1. What data is required?
2. Who owns the data?
3. Where is it stored?
4. How long is it retained?
5. Can the customer revoke access?

If unclear — **pause implementation**. `validatePrivacyByDesign()` in `lib/trust/privacy.ts`

---

## 14. Skill security review (§22)

Before releasing new skills, verify:

- Permission scope · data minimization · approval requirements · tenant isolation · audit logging

**Code:** `buildSkillSecurityReview()` in `lib/trust/review.ts`

---

## 15. Customer messaging (§23)

- *"Your operational data remains under your control."*
- *"Aipify stores intelligence, not ownership of your business."*
- *"Permissions are transparent and revocable."*
- *"Sensitive actions require approval."*

Constants: `CUSTOMER_TRUST_MESSAGES` in `lib/trust/engine.ts`

---

## 16. Future readiness (§24)

Architecture supports: cloud · hybrid · enterprise · customer-hosted deployments with a **consistent trust model**.

---

## Final principle

Aipify becomes trusted because of **what it refuses to collect**. The safest data is often the data that was never stored. Aipify exists to make businesses smarter — not to take ownership of their information.
