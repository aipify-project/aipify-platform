# Aipify Master Structure Blueprint

**Phase 500 — Permanent architecture lock**  
**Aipify Group AS · Bergen. Norway. For the world.**

This document defines where everything belongs in Aipify. Future features, Business Packs, modules, permissions, navigation, and customer experiences **must** follow this structure.

If a feature does not clearly belong to one of these layers, **pause and review architecture before implementation**.

---

## Core hierarchy

```
SUPER ADMIN          (Aipify Group AS ownership layer)
    ↓
PLATFORM             (Aipify Group AS operations layer)
    ├── APP          (Customer organization workspace)
    └── PARTNERS     (Growth Partner sales layer — sibling to APP)
         ↓
    EMPLOYEES        (Users inside APP — inherit access, never own licenses)
```

**Aipify principle:** PLATFORM sells · APP operates · EMPLOYEES use · PARTNERS sell.

**Customer ownership:** Customers always belong to **Aipify Platform**. Partners receive attribution and commission only — they do not own customers.

---

## SUPER ADMIN

**Purpose:** Own and govern the entire Aipify ecosystem.

**Who:** Aipify Group AS only.

**Route:** `/super/*` · `super.aipify.ai`

**Code:** `app/super/`, `components/super/`, `lib/super-admin/`

**Responsibilities:**

- System health
- Emergency controls
- Global governance
- Platform settings
- Module registry
- Feature flags
- Tenant controls
- License engine governance
- Security controls
- Platform ownership

**Must never:**

- Be accessed by customers
- Be accessed by Growth Partners
- Host customer business workflows

---

## PLATFORM

**Purpose:** Operate the Aipify business.

**Who:** Aipify Group AS platform operators (`platform_admins`, `platform_support`).

**Route:** `/platform/*`

**Code:** `app/platform/`, `components/platform/`, `lib/platform/`

**Responsibilities:**

- Customers (lifecycle, subscriptions, ownership)
- Growth Partners (program governance — not partner daily workspace)
- Subscriptions and billing
- Commissions and payouts oversight
- Business Pack catalog and marketplace
- Platform support and governance
- Customer success (platform view)
- Platform reporting and audit

**Rules:**

- PLATFORM **sells** products
- PLATFORM **owns** customers (tenant records, billing relationship)
- PLATFORM **manages** subscriptions

**Must never:**

- Become the customer daily operational workspace
- Expose one customer's operational data to another
- Mix Super Admin emergency controls with routine ops without audit

---

## APP

**Purpose:** The customer organization workspace.

**Who:** Paying customer organizations and their administrators.

**Examples:** Rørlegger Bergen AS · Hotel Nordic AS · Consulting Group AS · Warehouse Group AS

**Route:** `/app/*` · `app.aipify.ai`

**Code:** `app/app/`, `components/app/`, `lib/app/`

**Responsibilities:**

- Employees, roles, and permissions
- Knowledge, tasks, documents
- Companion (organization-scoped)
- Business Pack purchase, activation, and access grants
- Organization settings and reporting
- Workflows and daily operations
- Install management (customer view)

**Embedded runtime (Install Engine):** `/api/install/*`, `/api/embed/*` — APP-owned installation layer; never Platform Admin daily ops.

**Rules:**

- Every customer receives **APP**
- APP **purchases** Business Packs
- APP **installs** Business Packs
- APP **grants** employee access
- APP **controls** permissions

**Must never:**

- Expose platform-wide billing controls to standard customer roles
- Expose other tenants' data
- Host Super Admin or global governance

---

## EMPLOYEES

**Purpose:** Perform work inside APP.

**Who:** Users invited to a customer organization (`users` table, organization roles).

**Route:** Same as APP (`/app/*`) — scoped by role and permissions.

**Responsibilities:**

- Perform assigned work
- Use modules granted by APP
- Complete tasks and collaborate
- Access knowledge within permission scope

**Rules:**

- Employees **never** purchase Business Packs
- Employees **never** manage subscriptions
- Employees **never** own licenses directly
- Employees **inherit** access from APP license and pack grants

**License inheritance:** See [License hierarchy](#license-hierarchy) below.

---

## PARTNERS

**Purpose:** Generate leads and sales for Aipify.

**Position:** Sibling to APP under PLATFORM — not inside customer APP.

**Who:** Certified Growth Partners.

**Route:** `/partners/*` (canonical) · Growth Partner onboarding at `/growth-partners` · Partner operations may also surface at `/app/growth-partner` for partner-typed tenant workspaces — attribution always flows to PLATFORM.

**Code:** `app/partners/`, `components/partners-portal/`, `lib/partners-portal/`

**Responsibilities:**

- Training and certification
- Marketing and campaigns (auto-attributed links)
- Leads and pipeline
- Commissions and payouts (partner view)
- Partner reporting

**Rules:**

- Partners **do not own** customers
- Partners receive **attribution** and **commission**
- Customers belong to **PLATFORM**
- Partners **never** access Super Admin
- Partners **never** see other partners' data or customer internal APP systems

---

## Business Pack model

```
PLATFORM sells Business Pack catalog
        ↓
APP purchases / activates pack
        ↓
Pack installed for organization
        ↓
Pack menu / modules appear in APP
        ↓
APP grants roles / permissions
        ↓
EMPLOYEES use granted modules
```

**Example — Warehouse Pack:**

1. PLATFORM lists Warehouse Pack
2. APP (Warehouse Group AS) purchases
3. Pack activated on tenant
4. Warehouse navigation appears in APP
5. APP admin grants warehouse roles
6. Employees see Warehouse only if granted

**Feature owner for pack UI:** CUSTOMER APP (`/app/*` pack routes).  
**Feature owner for global pack governance:** PLATFORM (`/platform/*`).

---

## License hierarchy

```
PLATFORM
    ↓
APP License / subscription status
    ↓
APP organization status
    ↓
Employee access (inherited)
```

| APP status | Employee access |
|------------|-----------------|
| Active | Active |
| Trial | Active |
| Suspended | Suspended |
| Cancelled | Disabled |

| Business Pack status | Module availability |
|---------------------|---------------------|
| Active | Module available (if role granted) |
| Removed | Module hidden |

**Rules:**

- APP is always the **customer** (license holder)
- Employees never hold licenses directly
- Business Pack visibility follows APP pack state **and** role grants

**Code:** `lib/core/master-structure/license-hierarchy.ts` · License Center · `assert_license_capacity`

---

## Placement decision filter

Before any feature, skill, route, or RPC:

1. **Which layer?** SUPER ADMIN · PLATFORM · APP · EMPLOYEES · PARTNERS
2. **Who is the user?**
3. **Who owns the data?** (Platform vs tenant vs partner portfolio)
4. **Where does code live?** (see `lib/core/master-structure/layers.ts`)

If two layers appear equally valid → **stop** and resolve before coding.

**Programmatic registry:** `lib/core/master-structure/`

**Cursor rule:** `.cursor/rules/master-structure-blueprint.mdc`

---

## Relationship to other architecture docs

| Document | Role |
|----------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Repo paths, portal domains, phase index |
| [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) | Product identity and non-negotiables |
| [layer-ownership.mdc](./.cursor/rules/layer-ownership.mdc) | Implementation folder enforcement |
| [multi-tenant-separation.mdc](./.cursor/rules/multi-tenant-separation.mdc) | Tenant vs platform data isolation |

**Phase 500 supersedes ambiguous placement.** When older docs conflict with this blueprint, **this blueprint wins**.

---

## Final principle

Everything built in Aipify must belong to one of:

**SUPER ADMIN · PLATFORM · APP · EMPLOYEES · PARTNERS**

A platform becomes stronger when structure is clear before code is written.

**END OF BLUEPRINT.**
