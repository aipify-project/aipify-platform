# Aipify Skills Marketplace Naming Standard

## Purpose

Users browsing the Skills Marketplace should perceive Aipify as a mature business platform — not a collection of AI tools.

**There is only one Aipify.** Skill names describe capabilities Aipify provides; they are not separate assistant identities. See [AIPIFY_BRAND_RULE_SINGLE_IDENTITY.md](./AIPIFY_BRAND_RULE_SINGLE_IDENTITY.md).

## Rules

1. Never expose **AI** in skill names.
2. Users buy **Aipify**, not AI.
3. Present skills as **business capabilities**.
4. Use professional enterprise terminology.

## Preferred suffixes

Center · Specialist · Companion · Analyst · Briefing · Engine · Guardian · Intelligence · Operations

## Avoid

AI · GPT · Bot · Chatbot · Copilot · Assistant (in skill product names)

## Canonical replacements

| Avoid | Use |
|-------|-----|
| Analytics AI | Analytics Center |
| Commerce AI | Commerce Specialist |
| Executive AI | Executive Briefing |
| Marketing AI | Marketing Specialist |
| Moderation AI | Moderation Center |
| Memory Engine AI | Memory Engine |
| Support AI | Support Specialist |
| Knowledge AI | Knowledge Center |
| Compliance AI | Compliance Center |
| Growth AI | Growth Specialist |

## Implementation

- Code registry: `lib/core/skills/` — canonical `name` fields
- Runtime normalization: `lib/core/skills/display-names.ts` — `normalizeSkillDisplayName()`
- Skills Marketplace parse: `lib/skills-marketplace/parse.ts`, `lib/aipify/skills/parse.ts`
- Database: migration updates `public.skills.name` for legacy seed rows
- ILM: `lib/internal-language-model/skills-marketplace-naming-vocabulary.ts`

## Distinction from brand identity

General product copy may use **Aipify Support** (see [AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md](./AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md)). **Skills Marketplace skill cards** use **Support Specialist** and the table above.

All Skills remain **extensions of Aipify** — capability labels, not separate AI products ([AIPIFY_BRAND_RULE_SINGLE_IDENTITY.md](./AIPIFY_BRAND_RULE_SINGLE_IDENTITY.md)).
