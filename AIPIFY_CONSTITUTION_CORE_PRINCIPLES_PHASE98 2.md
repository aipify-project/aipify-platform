# Aipify Constitution & Core Principles — Phase 98

## Vision

**Technology guided by principles.**

Aipify shall remain accountable to the people, organizations and communities it serves.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260627000000_aipify_constitution_core_principles_phase98.sql` |
| Lib | `lib/aipify/constitution/` |
| API | `/api/aipify/constitution/*` |
| UI | `/app/constitution` — Constitutional governance hub |
| KC FAQ | `content/knowledge/aipify/aipify-constitution/faq/aipify-constitution-faq.md` |

## Twelve core principles

1. Humans Remain Responsible
2. Trust Must Be Earned
3. Clarity Over Complexity
4. Privacy Deserves Respect
5. Security Is Fundamental
6. Transparency Enables Trust
7. Innovation Requires Responsibility
8. People Matter Most
9. Local Context Matters
10. Learning Never Ends
11. Partnership Creates Strength
12. Long-Term Thinking Matters

## Database tables

- `constitution_settings`, `constitution_versions`, `constitution_core_principles`
- `constitution_reviews`, `constitution_stakeholder_feedback`
- `constitution_commitment_records`, `constitution_partner_alignment_reviews`
- `constitution_governance_decisions`, `constitution_acknowledgements`
- `constitution_principle_updates`, `constitution_briefings`, `constitution_audit_log`

## RPCs

- `get_aipify_constitution_dashboard()` — full constitutional dashboard
- `get_aipify_constitution_card()` — summary card
- `generate_aipify_constitution_briefing()` — alignment briefing
- `acknowledge_constitution_principle(uuid)` — acknowledge a principle
- `complete_constitution_review(uuid)` — complete a constitutional review

## Integrations

Governance Framework, Knowledge Center, Partners (alignment reviews), Academy (principle education), Innovation Lab (responsible evaluation)

## Principle

Principles matter most when circumstances become difficult. Values provide direction.
