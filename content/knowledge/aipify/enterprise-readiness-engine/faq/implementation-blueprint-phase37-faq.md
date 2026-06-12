# Implementation Blueprint Phase 37 — Enterprise Deployment & Governance Engine FAQ

## What is Phase 37 of the Implementation Blueprint?

Phase 37 aligns the Enterprise Readiness Engine (Phase A.30) with ABOS enterprise deployment and governance standards — trust, visibility, accountable governance, deployment flexibility, IAM scaffolds, and executive oversight.

## Which engine is the primary surface?

**Enterprise Readiness Engine Phase A.30** at `/app/enterprise-readiness-engine`. Phase 37 extends A.30 RPCs — do not duplicate Enterprise Deployment Phase 66, Framework Phase 92, Governance A.14, or Device Rollout A.39.

## How is A.30 different from Enterprise Deployment Phase 66?

**Phase 66** at `/app/enterprise` is the customer enterprise deployment workspace. **A.30** provides enterprise health, governance metadata, delegated admin, approval chains, and readiness scores. Blueprint Phase 37 adds deployment model scaffolds and IAM metadata to A.30.

## What deployment models are documented?

Cloud (fully managed), Hybrid (shared responsibility), and On-premise (customer-managed) — from `_edgbp_deployment_models()`. These are metadata scaffolds; actual configuration lives in Phase 66, Phase 92, and A.39.

## What IAM capabilities are scaffolded?

SSO, SAML federation, directory sync (SCIM), advanced roles, and regional administrators — from `_edgbp_identity_access_management()`. SSO/SAML are future-ready scaffolds until A.39 integration completes. Never fake connected state.

## What is the multi-entity hierarchy?

Parent org → regional orgs → departments → teams → users — from `_edgbp_multi_entity_support()`. Workspace switching via Organization & Workspace A.75 at `/app/organization-workspace-engine`.

## What governance controls does Phase 37 cover?

Approval workflows, retention policies, audit reporting, compliance visibility, and permission reviews — cross-linked to Governance A.14, Compliance A.29, and Human Oversight A.40.

## What executive capabilities are documented?

🦉 Executive insights, 📈 cross-org trends, 🔔 milestones, 🌹 recognition — from `_edgbp_executive_capabilities()`. Cross-org reporting via Executive Insights A.35.

## How does Self Love connect?

Sustainable decision-making, healthy communication, and human-centered leadership at scale — route `/app/self-love-engine`, principle only.

## What are the Phase 37 success criteria?

Computed live by `_edgbp_blueprint_success_criteria(organization_id)`: objectives documented, deployment models scaffold, IAM scaffold, multi-entity hierarchy, governance controls, executive capabilities, readiness score threshold, approval chains, trust and integration links.

## Where does dogfooding happen?

**Aipify Group** validates delegated admin, approval chains, and deployment readiness hooks internally. **Unonight** is the first external pilot for enterprise governance.

## Where is the dashboard?

`/app/enterprise-readiness-engine` — RPCs `get_enterprise_readiness_engine_dashboard()` and `get_enterprise_readiness_engine_card()`.

Migration: `supabase/migrations/20260988000000_implementation_blueprint_phase37_enterprise_deployment_governance.sql`
