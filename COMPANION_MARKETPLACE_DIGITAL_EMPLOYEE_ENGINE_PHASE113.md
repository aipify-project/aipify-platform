# Companion Marketplace & Digital Employee Engine (Phase 113)

**Feature owner:** CUSTOMER APP  
**Route:** `/app/companion-marketplace`  
**Migration:** `supabase/migrations/20261203000000_companion_marketplace_digital_employee_engine_phase113.sql`  
**Blueprint:** [IMPLEMENTATION_BLUEPRINT_PHASE113_COMPANION_MARKETPLACE_DIGITAL_EMPLOYEE.md](./IMPLEMENTATION_BLUEPRINT_PHASE113_COMPANION_MARKETPLACE_DIGITAL_EMPLOYEE.md)

## Vision & philosophy

Companions are **trusted digital coworkers** — NOT chatbots.

- **People First. Technology Second.**
- **Companionship before replacement.**
- Humans remain accountable for every decision.

## Distinction from related surfaces

| Surface | Route |
|---------|-------|
| Skills Marketplace Blueprint 112 | `/app/marketplace` |
| Skill Store Phase 63 | `/app/skills` |
| Commerce Companion Phase 110 | `/app/commerce-companion` |
| Companion Identity A.84 | `/app/companion-identity-engine` |
| Industry Packs Blueprint 111 | `/app/business-packs-foundation-engine` |
| Marketplace Governance Phase 90 | `/app/marketplace-governance` |
| Trust & Action Phase 30 | `/app/approvals` |
| Proactive Companion A.79 | `/app/proactive-companion-engine` |

## Companion Marketplace categories

Executive · Support · Sales · Growth Partner · Commerce · Knowledge · HR · Compliance · Operations · Industry · Custom Enterprise Companions

## Companion profile structure

Name, Role, Description, Primary Capabilities, Supported Languages, Department Assignment, Version, Creator Info, Knowledge Requirements, Required Integrations, Risk Classification, Recommended Org Size, Maturity Level, Customer Rating, Usage Statistics, Release Notes, Governance Status, Audit Status, Approval Status

## Digital Employee model

Role Identity, Organizational Context, Responsibilities, Permission Boundaries, Escalation Paths, Performance Indicators, Audit Trail, Learning Restrictions, Governance Controls. **Never autonomous decision-makers.**

## Digital Employee types

Assistant · Advisor · Analyst · Coordinator · Knowledge · Support · Executive · Growth Employee

## Deployment flow (10 steps)

Browse → Review profile → Review permissions → Review governance → Assign scope → Configure integrations → Define escalation → Activate → Monitor → Optimize

## Governance layers (1–5)

1. **Observation** — read-only  
2. **Recommendation** — human approval  
3. **Assisted Action** — human confirmation  
4. **Operational Automation** — pre-approved low-risk  
5. **Enterprise Restricted** — enhanced controls, mandatory logging, executive visibility

## Companion directory fields

Name, Assigned Team, Status, Usage Frequency, Recent Activities, Satisfaction Score, Escalation Rate, Governance Level, Owner, Version Status, Security Status

## Health monitoring metrics

Recommendation Quality, Escalation Frequency, Response Accuracy, User Satisfaction, Adoption, Support Reduction, Workflow Efficiency, Knowledge Utilization, Policy Compliance, Error Recovery Success

## Collaboration rules

Support+Knowledge, Executive+Analytics, Commerce+Growth — requires explicit governance approval, interaction rules, audit, human visibility.

## Lifecycle states

Draft, Testing, Pilot, Approved, Active, Under Review, Deprecated, Retired, Historical Archive

## Enterprise Digital Employee Center

Provision, Deactivate, Review permissions, Audit logs, Monitor effectiveness, Review recommendations, Approve upgrades, Security requirements, 2FA enforcement, Governance alerts

## Security cross-links

- `/app/settings/two-factor`
- `/verify-2fa`
- Migration `20261202000000_two_factor_authentication_system.sql`
- Mandatory 2FA: Super Admin, Executive, Security Administrator, Marketplace Publisher, Companion Developers

## Success metrics

Reduced overload, higher consistency, improved CX, faster onboarding, knowledge retention, employee satisfaction, governance outcomes, organizational resilience, healthier human-Aipify collaboration

## Technical layout

| Layer | Path |
|-------|------|
| Migration & RPCs | `supabase/migrations/20261203000000_*` — `_cmpm_*`, `_cmbp113_*` |
| Types & parse | `lib/aipify/companion-marketplace/` |
| API | `app/api/aipify/companion-marketplace/` |
| UI | `app/app/companion-marketplace/`, `components/app/companion-marketplace/` |
| i18n | `customerApp.companionMarketplace.*`, `customerApp.nav.companionMarketplaceEngine` |
| ILM | `implementation-blueprint-phase113-*` |

## RPCs

- `get_companion_marketplace_dashboard(p_tenant_id)`
- `get_companion_marketplace_card(p_tenant_id)`
- `activate_companion_marketplace_deployment(p_deployment_id)` — human-approval gates
- `deactivate_companion_marketplace_deployment(p_deployment_id)`
