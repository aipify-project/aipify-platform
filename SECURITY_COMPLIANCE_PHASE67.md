# Security, Compliance & Data Governance (Phase 67)

Phase 67 builds Aipify's security and compliance foundation: Policy Engine, data classification, access policies, GDPR privacy workflows, retention, security incidents, secrets references, and compliance reports.

## Core principle

Before Aipify performs any meaningful action:

> **Am I allowed to do this?**

Evaluated via tenant settings, roles, deployment mode, data classification, governance rules, and access policies.

## Customer App routes

| Route | Purpose |
|-------|---------|
| `/app/security` | Security dashboard — incidents, policy decisions |
| `/app/security/incidents` | Security incident management |
| `/app/security/secrets` | Secret references (no raw values) |
| `/app/security/policies` | Access policies + policy test |
| `/app/compliance` | Compliance dashboard |
| `/app/compliance/privacy-requests` | GDPR-style privacy requests |
| `/app/compliance/data-governance` | Classifications + retention |
| `/app/compliance/reports` | Generate compliance reports |

## API routes

| Route | Purpose |
|-------|---------|
| `/api/aipify/security/card` | Home card |
| `/api/aipify/security/dashboard` | Security dashboard |
| `/api/aipify/security/incidents` | List/create incidents |
| `/api/aipify/security/secrets` | List/register secrets |
| `/api/aipify/security/policies` | Access policies |
| `/api/aipify/policy/evaluate` | **Policy Engine** evaluation |
| `/api/aipify/compliance/dashboard` | Compliance dashboard |
| `/api/aipify/compliance/privacy-requests` | Privacy requests |
| `/api/aipify/compliance/data-governance` | Data governance overview |
| `/api/aipify/compliance/reports` | Compliance reports |
| `/api/aipify/compliance/retention/apply` | Apply retention job |
| `/api/aipify/compliance/unonight/seed` | Unonight classifications |

## Database (migration `20260615700000_security_compliance_phase67.sql`)

- `data_classification_policies` — public through never_store
- `access_policies` — role-based rules per action/resource
- `policy_decisions` — evaluation audit trail
- `privacy_requests` — export/delete/anonymize workflows
- `retention_policies` — per-category retention
- `security_incidents` — incident response
- `compliance_reports` — generated reports
- `secret_references` — vault refs only (no raw secrets)
- `security_audit_events` — security-specific audit log

Key RPC: `evaluate_policy(p_request jsonb)` — central Policy Engine.

## Data classifications

| Level | Examples |
|-------|----------|
| `public` | Marketing FAQ, public help |
| `internal` | Workflows, admin notes |
| `confidential` | Support conversations, reports |
| `sensitive` | Personal data, verification status |
| `restricted` | API keys, tokens |
| `never_store` | Passwords, full card data |

## Policy Engine integration

Call `evaluate_policy` before:
- Support AI external replies
- Knowledge retrieval (restricted)
- Memory storage
- Desktop sensitive notifications
- Automation execution
- Agent cloud sync
- Data export/deletion

Checks: Emergency Stop, classification, deployment mode, access policies, cloud sync policy.

## Library

`lib/aipify/security-compliance/` — types, parse, module constants.

## Worker jobs (V1 stubs)

- `apply_retention_policies()` — queues retention run
- `generate_compliance_report()` — structured JSON reports

## Unonight pilot

`seed_unonight_security_classifications()` adds policies for verification, moderation, member messages, marketplace payment data.

## Knowledge Center

Category: `security-compliance`  
Seed: `content/knowledge/aipify/security/faq/security-compliance-faq.md`

## What is NOT in V1

- Full legal compliance automation
- SOC2/ISO certification system
- Raw secrets in database tables
- Auto-deletion of audit logs
- SIEM integrations
