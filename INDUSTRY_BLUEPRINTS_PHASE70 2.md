# Industry Blueprints & Vertical Operating Models — Phase 70

Industry-aware onboarding layer that recommends Skills, Marketplace Packs, workflows, Knowledge, Governance, and Quality settings by business type.

## Philosophy

Blueprints recommend; admins review and approve before anything is applied. No auto-install without governance.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/industry-blueprints` | Dashboard with completeness score and pending recommendations |
| `/app/industry-blueprints/catalog` | Browse official blueprints |
| `/app/industry-blueprints/[slug]` | Blueprint detail, select, and apply |
| `/app/industry-blueprints/recommendations` | Accept/reject/dismiss recommendations |
| `/app/industry-blueprints/applied` | Applied blueprint history |
| `/app/industry-blueprints/settings` | Industry profile and preferences |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/industry-blueprints` | `list_industry_blueprints` |
| `GET /api/aipify/industry-blueprints/[id]` | `get_industry_blueprint` |
| `GET /api/aipify/industry-profile` | `get_tenant_industry_profile` |
| `PATCH /api/aipify/industry-profile` | `update_tenant_industry_profile` |
| `POST /api/aipify/industry-blueprints/recommend` | `generate_blueprint_recommendations` |
| `GET /api/aipify/industry-blueprints/recommendations` | `list_blueprint_recommendations` |
| `PATCH /api/aipify/industry-blueprints/recommendations/[id]` | `update_blueprint_recommendation` |
| `POST /api/aipify/industry-blueprints/[id]/precheck` | `precheck_blueprint_apply` |
| `POST /api/aipify/industry-blueprints/[id]/apply` | `apply_industry_blueprint` |
| `GET /api/aipify/industry-blueprints/applied` | `list_blueprint_applied` |

## Apply flow

1. Admin selects blueprint → recommendations generated
2. Admin reviews recommendations (accept/reject)
3. Precheck: deployment mode, Policy Engine, risk level
4. Approval required for medium/high risk blueprints
5. Apply installs Skills via `install_tenant_skill` and Packs via `install_marketplace_item`
6. Audit events and orchestration `blueprint.applied`

## Migration

`supabase/migrations/20260616000000_industry_blueprints_phase70.sql`

## Official seed blueprints (8)

- E-commerce
- Restaurant / Hospitality
- Agency / Consulting
- SaaS Company
- Law Firm
- Education / School
- Municipality / Public Sector
- Local Service Business

## Knowledge Center

Category: `industry-blueprints`  
FAQ: `content/knowledge/aipify/industry-blueprints/faq/industry-blueprints-faq.md`

Import: `POST /api/aipify/knowledge/import-seed-content` with `{ "overwrite": true }`

## Integrations

- **Marketplace (Phase 69):** Pack installs via `install_marketplace_item`
- **Skill Store (Phase 63):** Skill installs via `install_tenant_skill`
- **Policy Engine:** `evaluate_policy` on apply precheck
- **Orchestration (Phase 68):** `emit_orchestration_event` on apply
- **Install/Discovery (Phase 57):** `tenant_industry_profiles` extends discovery

## Out of scope (V1)

- Hundreds of industries
- Legal compliance guarantee engine
- Automatic paid pack purchases
- Cross-tenant custom blueprint sharing
- Uncontrolled auto-install
