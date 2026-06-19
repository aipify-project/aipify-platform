# AIPIFY – PHASE 556

**TITLE:** Companion Skills Ecosystem, Specialist Marketplace & Capability Engine  
**PURPOSE:** Capability layer allowing Companion to gain expertise through installable skills, specialist packages, and governed organizational knowledge modules.

## Feature owner

**CUSTOMER APP** — `/app/companion/skills`

## Core principle

The Companion should not know everything by default. Organizations decide what Companion knows and can do through approved skills.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/companion/skills` | Companion Skills Center hub |
| `/app/companion/skills/marketplace` | Skill Marketplace |
| `/app/companion/skills/training` | Skill Training Engine |

## RPCs

- `get_organization_companion_skills_center(p_section)`
- `perform_organization_companion_skills_action(p_action_type, p_payload)`
- `get_organization_companion_skills_mobile_summary()`
- `get_companion_skills_advisor_context(p_query)`

## Tables

`organization_companion_skills_settings` · `organization_companion_skills_registry` · `organization_companion_skills_marketplace` · `organization_companion_skills_specialists` · `organization_companion_skills_knowledge_sources` · `organization_companion_skills_training` · `organization_companion_skills_capability_profiles` · `organization_companion_skills_capability_bundles` · `organization_companion_skills_business_pack_skills` · `organization_companion_skills_health` · `organization_companion_skills_audit_logs`

## APIs

- `GET /api/app/companion-skills-operations`
- `POST /api/app/companion-skills-operations/action`
- `GET /api/app/companion-skills-operations/mobile`
- `GET /api/assistant/companion-skills-advisor-context`

**END OF PHASE.**
