# Companion Marketplace & Digital Employee Engine FAQ (Phase 113)

## What is Phase 113?

Phase 113 introduces the **Companion Marketplace & Digital Employee Engine** at `/app/companion-marketplace` — a unified surface for Companion Marketplace discovery, Digital Employee provisioning, and Enterprise Digital Employee Center administration.

## How is this different from the Skills Marketplace (Phase 112)?

**Skills Marketplace (Phase 112)** at `/app/marketplace` is for Skills and Extensions that expand platform capabilities. **Companion Marketplace (Phase 113)** is for **trusted digital coworkers** — governed digital employees with role identity, permissions, escalation paths, and health monitoring. Cross-link only — do not duplicate.

## How is this different from the Skill Store (Phase 63)?

**Skill Store** at `/app/skills` installs individual skills. Companion Marketplace deploys **digital employees** with governance layers, directory tracking, and enterprise center controls.

## How is this different from Commerce Companion (Phase 110)?

**Commerce Companion** at `/app/commerce-companion` is the unified daily commerce hub. Companion Marketplace is **organization-wide** digital employee provisioning across all departments — commerce is one catalog category with a cross-link to Phase 110.

## Are Companions chatbots?

**No.** Companions are trusted digital coworkers. People First. Technology Second. Humans remain accountable.

## What is the deployment flow?

Browse → Review profile → Review permissions → Review governance → Assign scope → Configure integrations → Define escalation → **Activate (human approval)** → Monitor → Optimize

## What are governance layers?

1. Observation (read-only)  
2. Recommendation (human approval)  
3. Assisted Action (human confirmation)  
4. Operational Automation (pre-approved low-risk)  
5. Enterprise Restricted (enhanced controls, mandatory logging, executive visibility)

## Can Companions activate automatically?

**No.** `human_approval_required` defaults to true. High-risk Companions require governance level 3+ and Approval Center review (`/app/approvals`).

## What data does the engine store?

Metadata only — catalog profiles, deployment directory fields, aggregate health snapshots, and immutable audit events. No PII, no raw chat transcripts.

## What is mandatory 2FA?

Cross-link `/app/settings/two-factor` and migration `20261202000000_two_factor_authentication_system.sql`. Mandatory for: Super Admin, Executive, Security Administrator, Marketplace Publisher, Companion Developers.

## What are the health monitoring metrics?

Recommendation Quality, Escalation Frequency, Response Accuracy, User Satisfaction, Adoption, Support Reduction, Workflow Efficiency, Knowledge Utilization, Policy Compliance, Error Recovery Success.

## What are collaboration rules?

Examples: Support+Knowledge, Executive+Analytics, Commerce+Growth. Each requires explicit governance approval, interaction rules, audit, and human visibility.

## What is the helper prefix?

Engine: `_cmpm_*`. Blueprint Phase 113: `_cmbp113_*` — must not collide with `_mkp_*`, `_sembp112_*`, or `_ccom_*`.

## What is the vision phrase?

*"Every team has trusted digital coworkers — and humans remain in charge."*

## What success metrics does Phase 113 target?

Reduced overload, higher consistency, improved CX, faster onboarding, knowledge retention, employee satisfaction, governance outcomes, organizational resilience, healthier human-Aipify collaboration.
