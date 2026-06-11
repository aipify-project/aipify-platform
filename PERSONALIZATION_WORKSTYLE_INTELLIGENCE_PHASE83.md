# Personalization & Workstyle Intelligence Engine — Phase 83

Build a Personalization & Workstyle Intelligence Engine that allows Aipify to adapt its communication style, learning methods, notifications and assistance patterns to individual users while preserving privacy, trust and human control.

## Core principle

**Aipify adapts to people. People never adapt to Aipify.**

Users control personalization. Aipify suggests — never imposes.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/settings/personalization` | User workstyle profile, suggestions, privacy controls |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/workstyle/card` | `get_workstyle_card` |
| `GET /api/aipify/workstyle/settings` | `get_personalization_settings` |
| `POST /api/aipify/workstyle/profile` | `update_workstyle_profile` |
| `DELETE /api/aipify/workstyle/profile` | `disable_workstyle_personalization` |
| `POST /api/aipify/workstyle/suggestions/[id]/accept` | `accept_preference_suggestion` |
| `POST /api/aipify/workstyle/suggestions/[id]/dismiss` | `dismiss_preference_suggestion` |
| `GET /api/aipify/workstyle/greeting` | `generate_workstyle_desktop_greeting` |

## Workstyle dimensions

| Dimension | Options |
|-----------|---------|
| Communication | professional, warm_professional, playful, executive, technical |
| Notification | minimal, balanced, proactive, critical_only |
| Learning | articles, videos, mini_guides, walkthroughs, step_by_step |
| Explanation | simple, operational, technical |
| Collaboration | independent, collaborative, approval_oriented, guided |
| Desktop | morning_briefings, afternoon_summaries, minimal, full_assistant |

## Suggestion confidence

| Level | Meaning |
|-------|---------|
| HIGH | Explicitly configured |
| MEDIUM | Repeated behavioral confirmation |
| LOW | Tentative suggestion only |

## Migration

`supabase/migrations/20260617500000_personalization_workstyle_intelligence_phase83.sql`

Tables: `workstyle_profiles`, `user_preferences`, `preference_suggestions`, `workstyle_org_policies`, `workstyle_audit_log`

## Integrations

| Module | Use |
|--------|-----|
| Personality Engine | Communication tone sync |
| Human Success | Adoption and learning personalization |
| Memory Engine | Approved preferences only |
| Trust Engine | Transparent suggestion explanations |
| Knowledge Center | Learning format recommendations |
| Desktop Companion | Adaptive greetings and notification respect |
| Assistant Identity | Name and tone alignment |

## Library

`lib/aipify/workstyle/` — types, parse

## Knowledge Center

Category: `personalization`  
FAQ: `content/knowledge/aipify/personalization/faq/personalization-faq.md`

## Privacy safeguards

- No employee evaluation or performance ranking
- No hidden profiling
- No cross-tenant sharing
- Suggestions require explicit consent
- Users may disable personalization entirely

## Out of scope

- Hidden profiling systems
- Mandatory personalization
- Cross-user behavioral comparisons
- Employee scoring
