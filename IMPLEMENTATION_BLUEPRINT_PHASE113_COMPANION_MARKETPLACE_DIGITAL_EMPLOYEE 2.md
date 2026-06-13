# Implementation Blueprint Phase 113 — Companion Marketplace & Digital Employee Engine

**Route:** `/app/companion-marketplace`  
**Engine helpers:** `_cmpm_*`  
**Blueprint helpers:** `_cmbp113_*` (never collide with `_mkp_*`, `_sembp112_*`, `_ccom_*`)

## Mission

Trusted Companion Marketplace and Digital Employee provisioning — digital coworkers that augment teams, never replace human accountability.

## Philosophy

People First. Technology Second. Companionship before replacement.

## ABOS principle

Aipify informs and prepares; humans approve Companion activation. Metadata only in health and audit — no PII, no raw chat.

## Blueprint sections (SQL helpers)

| Helper | Section |
|--------|---------|
| `_cmbp113_mission` | Mission |
| `_cmbp113_philosophy` | Philosophy |
| `_cmbp113_objectives` | Objectives |
| `_cmbp113_categories` | Marketplace categories |
| `_cmbp113_profile_fields` | Companion profile structure |
| `_cmbp113_digital_employee_model` | Digital Employee model |
| `_cmbp113_employee_types` | Digital employee types |
| `_cmbp113_deployment_flow` | 10-step deployment flow |
| `_cmbp113_governance_layers` | Governance layers 1–5 |
| `_cmbp113_directory_fields` | Companion directory |
| `_cmbp113_health_metrics` | Health monitoring |
| `_cmbp113_collaboration_rules` | Collaboration rules |
| `_cmbp113_lifecycle_states` | Lifecycle states |
| `_cmbp113_enterprise_center` | Enterprise Digital Employee Center |
| `_cmbp113_security_requirements` | 2FA cross-links |
| `_cmbp113_success_metrics` | Success metrics |
| `_cmbp113_cross_links` | Distinction cross-links |
| `_cmbp113_limitation_principles` | Limitation principles |
| `_cmbp113_companion_adaptation` | Companion adaptation 🦉🌹🔔 |
| `_cmbp113_blueprint_block` | Full `implementation_blueprint` jsonb |

## Dashboard integration

`get_companion_marketplace_dashboard` returns baseline metrics plus `implementation_blueprint` jsonb block with all Phase 113 blueprint data.

## KC FAQ

`content/knowledge/aipify/companion-marketplace/faq/companion-marketplace-digital-employee-faq.md`
