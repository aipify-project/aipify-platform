# App Ecosystem & Developer Platform — Phase 75

Transform Aipify into an extensible platform with a secure App Ecosystem and Developer Platform for building, publishing, and maintaining extensions.

## Philosophy

Apps are guests inside Aipify — never owners. Every app is permission-aware, governance-controlled, policy-validated, security-reviewed, tenant-isolated, auditable, versioned, and explainable.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/apps` | Installed apps, catalog, updates, install flow |
| `/app/apps/[id]` | App detail — permissions, versions, reviews, telemetry |
| `/developers` | Developer Portal — SDK, manifest spec, sandbox, publishing |

## API

| Endpoint | RPC / action |
|----------|--------------|
| `GET /api/aipify/apps/card` | `get_ecosystem_apps_card` |
| `GET /api/aipify/apps/dashboard` | `get_ecosystem_apps_dashboard` |
| `GET /api/aipify/apps` | `list_ecosystem_apps` |
| `GET /api/aipify/apps/[id]` | `get_ecosystem_app` |
| `POST /api/aipify/apps/[id]/precheck` | `precheck_ecosystem_app_install` |
| `POST /api/aipify/apps/install` | `install_ecosystem_app` |
| `POST /api/aipify/apps/uninstall` | `uninstall_ecosystem_app` |
| `POST /api/aipify/apps/update` | `update_ecosystem_app` |
| `POST /api/aipify/apps/reviews` | `record_ecosystem_app_review` |
| `POST /api/aipify/apps/validate-manifest` | `validate_app_manifest` |
| `POST /api/aipify/apps/submit-review` | `submit_ecosystem_app_review` |
| `POST /api/aipify/apps/jobs/run` | Review queue, update checker, telemetry |

## SDK (`lib/aipify/app-ecosystem/`)

- `defineAipifySkill`, `defineAgentExtension`, `defineDashboardWidget`, `defineWorkflowPack`, `defineKnowledgePack`
- `validateAppManifest` — client-side manifest validation
- `SANDBOX_RESTRICTIONS`, `SDK_VERSION`

## App categories

skill, agent_extension, industry_blueprint, knowledge_pack, workflow_pack, automation_pack, desktop_extension, dashboard_module, integration, analytics_module, developer_utility

## Partner tiers

internal, verified_developer, agency_partner, enterprise_partner

## Migration

`supabase/migrations/20260616500000_app_ecosystem_developer_platform_phase75.sql`

Tables: `ecosystem_apps`, `ecosystem_app_versions`, `tenant_ecosystem_app_installs`, `ecosystem_app_reviews`, `ecosystem_app_metrics`, `ecosystem_app_review_requests`, `ecosystem_app_audit_log`

Note: Uses `ecosystem_apps` (not bare `apps`) to avoid generic naming conflicts.

## Integrations

- **Policy Engine:** install precheck and publish governance review
- **Orchestration:** `emit_orchestration_event` on install
- **Marketplace:** extends partner publish via `marketplace_partners`
- **Audit:** `_tacc_log_audit` via `_eco_log_audit`

## Worker jobs

- `process_ecosystem_app_review_queue` — app_review_processor
- `check_ecosystem_app_updates` — app_update_checker
- `collect_ecosystem_app_telemetry` — app_telemetry_collector

## Knowledge Center

Category: `developers`  
FAQ: `content/knowledge/aipify/developers/faq/developers-faq.md`  
Full KB: See [DEVELOPER_KNOWLEDGE_CENTER.md](./DEVELOPER_KNOWLEDGE_CENTER.md)

## Out of scope (V1)

- Unrestricted plugin execution
- Apps bypassing Governance, Policy Engine, or Sandbox
- Direct secret access for third-party apps
- Revenue share / partner billing
