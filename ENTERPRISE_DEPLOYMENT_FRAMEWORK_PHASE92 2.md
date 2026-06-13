# Enterprise Deployment Framework — Phase 92

## Vision

**Enterprise-grade AI without enterprise complexity.**

Aipify is deployable in ways that align with each organization's security posture, operational model, and regulatory obligations.

## Relationship to Phase 66

Phase 66 established hybrid/on-premise agent architecture, data residency, and connectors. Phase 92 adds the **structured deployment methodology** — readiness assessment, staged rollout, governance, IAM, change management, and executive visibility.

| Layer | Phase 66 | Phase 92 |
|-------|----------|----------|
| Infrastructure | Agents, jobs, residency | Deployment projects & stages |
| Governance | Settings flags | Policy engine & compliance |
| Adoption | — | Readiness, change management, metrics |
| Executive | Basic dashboard | Framework score & briefings |

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260621000000_enterprise_deployment_framework_phase92.sql` |
| Lib | `lib/aipify/enterprise-deployment-framework/` |
| API | `/api/aipify/enterprise-deployment-framework/*` |
| UI | `/app/enterprise/framework` — Executive Deployment Framework |
| KC FAQ | `content/knowledge/aipify/enterprise/faq/enterprise-deployment-framework-faq.md` |

## Database tables

- `enterprise_deployment_projects` — deployment projects with model and stage
- `enterprise_readiness_assessments` — 7-area readiness evaluation
- `enterprise_deployment_stages` — 5-phase deployment lifecycle
- `enterprise_framework_roles` — enterprise RBAC roles
- `enterprise_framework_security_policies` — security controls
- `enterprise_framework_governance_policies` — governance requirements
- `enterprise_framework_integrations` — integration catalog
- `enterprise_framework_change_initiatives` — change management
- `enterprise_framework_continuity_plans` — business continuity
- `enterprise_framework_success_metrics` — adoption and outcome metrics
- `enterprise_framework_settings`, `enterprise_framework_briefings`, `enterprise_framework_audit_log`

## Deployment models

1. Multi-Tenant SaaS
2. Dedicated Tenant Cloud
3. Enterprise Private Cloud
4. Hybrid Deployment
5. On-Premise Deployment

## Deployment stages

1. Discovery & Assessment
2. Solution Design
3. Pilot Deployment
4. Enterprise Rollout
5. Optimization

## RPCs

- `get_enterprise_deployment_framework_dashboard()` — full framework dashboard
- `get_enterprise_deployment_framework_card()` — summary card
- `generate_enterprise_deployment_briefing()` — executive briefing
- `advance_enterprise_deployment_stage(uuid)` — advance project stage
- `activate_enterprise_governance_policy(uuid)` — activate governance policy

## Integrations

Phase 66 deployment settings, enterprise connectors, partner certification, governance audit, Knowledge Center

## Human oversight

High-impact deployment decisions require human approval. All framework actions are audit-logged.
