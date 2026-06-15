# Skills Marketplace Experience Engine — Phase 260

## Purpose

Transform the Skills section from a technical module list into a premium Skills Marketplace experience. Users should immediately understand: **"What can Aipify do for me?"**

**Feature owner:** Customer App (`/app/skills`) · Platform Admin (`/platform/skills`)

## Core principle

Skills should feel like **hiring new capabilities** — not enabling technical features.

## Sections

1. **Skills Overview** — installed, available, pilot, pending reviews
2. **Installed Skills** — premium cards with status, version, environment, owner
3. **Recommended Skills** — why recommended + expected impact + activation
4. **Skills Marketplace** — App Store–inspired catalog with categories
5. **Skill Deployment Pipeline** — Internal Development → Customer Zero → Pilot → Growth Partners → Stable Release
6. **Skill Governance** — approvals, permissions, risk, review history
7. **Skill Performance** — success rate, usage, satisfaction

## Architecture

```
supabase/migrations/20261447000000_skills_marketplace_experience_phase260.sql
  get_skills_marketplace_experience(p_scope)

lib/skills-marketplace/
  types.ts · parse.ts · labels.ts

components/shared/skills-marketplace/
  SkillsMarketplaceExperiencePanel.tsx

components/app/skills/
  SkillDetailExperiencePanel.tsx  — tabbed detail (overview, capabilities, permissions, audit, performance, deployment, FAQ, controls)

app/api/skills-marketplace/route.ts
```

## Copywriting

Describe **business capabilities**, never "AI features":
- Operations Assistant (not AI Automation Engine)
- Revenue Intelligence (not AI Revenue Predictor)
- Support Specialist (not Support AI)
- Analytics Center (not Analytics AI)

See [AIPIFY_SKILLS_MARKETPLACE_NAMING_STANDARD.md](./AIPIFY_SKILLS_MARKETPLACE_NAMING_STANDARD.md).

## Routes

| Portal | Route |
|--------|-------|
| Customer | `/app/skills`, `/app/skills/[key]` |
| Platform | `/platform/skills` |

## i18n

`customerApp.skillsMarketplace.*` · `platform.skillsMarketplace.*` in en/no/sv/da

## Final principle

Customers should never feel like they are activating software components. They should feel like they are **expanding the capabilities of their organization**.
