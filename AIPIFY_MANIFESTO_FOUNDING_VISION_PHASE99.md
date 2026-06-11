# Aipify Manifesto & Founding Vision — Phase 99

## Vision

**Purpose beyond functionality.**

The Manifesto defines why Aipify was created and what it ultimately seeks to become.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260628000000_aipify_manifesto_founding_vision_phase99.sql` |
| Lib | `lib/aipify/manifesto/` |
| API | `/api/aipify/manifesto/*` |
| UI | `/app/manifesto` — Founding vision hub |
| KC FAQ | `content/knowledge/aipify/aipify-manifesto/faq/aipify-manifesto-faq.md` |

## Core manifesto beliefs

1. Technology Should Help People Flourish
2. Complexity Should Be Reduced
3. Organizations Deserve Intelligent Support
4. Trust Must Be Earned
5. Innovation Requires Responsibility
6. Learning Never Ends
7. The Future Can Become More Human
8. We Choose to Build Toward That Future

## Database tables

- `manifesto_settings`, `manifesto_versions`, `founding_statements`
- `strategic_themes`, `organizational_commitments`, `vision_updates`
- `manifesto_stakeholder_feedback`, `manifesto_acknowledgements`
- `vision_publications`, `manifesto_briefings`, `manifesto_audit_log`

## RPCs

- `get_aipify_manifesto_dashboard()` — full manifesto dashboard
- `get_aipify_manifesto_card()` — summary card
- `generate_aipify_manifesto_briefing()` — vision alignment briefing
- `acknowledge_manifesto_theme(uuid)` — acknowledge a strategic theme
- `complete_vision_update(uuid)` — complete a vision update review

## Integrations

Constitution (principles alongside vision), Knowledge Center, Academy (founding vision learning), Partners (vision alignment), Global Expansion (local understanding)

## Principle

The Manifesto provides meaning beyond functionality. It reminds the organization why Aipify exists.
