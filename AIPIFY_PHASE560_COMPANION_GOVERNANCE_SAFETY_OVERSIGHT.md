# AIPIFY – PHASE 560

**TITLE:** Companion Governance, Safety, Oversight & Trust Framework

**PURPOSE:** Create the governance framework that ensures Companion always operates safely, transparently, predictably, and under organizational control — the trust and safety layer of Companion.

**Feature owner:** CUSTOMER APP

**Routes:**
- `/app/companion/governance` — Companion Governance Center
- `/app/companion/governance/actions` — Action Review Center
- `/app/companion/governance/audit` — Audit Center

## Objectives

- Companion Governance Center (Overview, Permissions, Capabilities, Actions, Oversight, Approvals, Policies, Reports, Executive, Audit)
- Capability Registry (skills, specialists, knowledge, integrations, actions, permissions, business packs)
- Transparency Engine and recommendation transparency (reason, confidence, sources, assumptions, risks, alternatives)
- Confidence framework (high / moderate / limited)
- Human approval framework for sensitive actions
- Policy engine (organization, department, companion, business pack, regional, compliance)
- Permission boundaries, oversight dashboard, risk detection, ethics framework
- Knowledge governance, memory governance (Phase 558), specialist governance (Phase 559)
- Audit center, executive dashboard, trust score, review board, mobile access, audit logging

## Components

| Layer | Path |
|-------|------|
| Migration | `supabase/migrations/20261856000000_companion_governance_safety_oversight_trust_framework_phase560.sql` |
| Library | `lib/customer-companion-governance-operations/` |
| APIs | `/api/app/companion-governance-operations/*`, `/api/assistant/companion-governance-advisor-context` |
| UI | `components/app/companion-governance-operations/` |
| Pages | `app/app/companion/governance/page.tsx`, `governance/actions/page.tsx`, `governance/audit/page.tsx` |
| i18n | `locales/{en,no,sv,da}/customer-app/settings.json` (`companionGovernanceOperations.*`) |

## Integration

- Phase 558 Memory: `/app/companion/memory`
- Phase 559 Orchestration: `/app/companion/orchestration`
- Approvals: `/app/approvals`

## RPCs

- `get_organization_companion_governance_center(p_section)`
- `perform_organization_companion_governance_action(p_payload)`
- `get_organization_companion_governance_mobile_summary()`
- `get_assistant_companion_governance_advisor_context()`

## Principle

Capability without governance creates risk. Intelligence without transparency creates distrust. Automation without oversight creates problems.

One Companion. One Governance Framework. One Trust Layer.

**END OF PHASE.**
