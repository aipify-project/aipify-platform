# Community & Collective Intelligence Engine — Phase 89

## Core principle

**Collective Intelligence amplifies wisdom. Not compromise trust.**

Organizations learn from one another through governed, anonymized, and validated community intelligence.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260618100000_community_collective_intelligence_phase89.sql` |
| Lib | `lib/aipify/community-intelligence/` |
| API | `/api/aipify/community-intelligence/*` |
| UI | `/app/community` — Community Hub; `/app/community/admin` — Admin Dashboard |
| KC FAQ | `content/knowledge/aipify/community/faq/community-intelligence-faq.md` |

## Database tables

- `community_contributions` — contribution workflow with anonymized published content
- `community_reviews` — moderation and governance review decisions
- `community_ratings` — community usefulness ratings (1–5)
- `community_scores` — Collective Contribution Score and Community Health Score
- `community_briefings` — executive community intelligence briefings
- `community_settings` — opt-in participation and governance controls
- `community_audit_log` — audit trail

## Contribution types

Knowledge Articles, Implementation Guides, Blueprint Enhancements, Business Pack Reviews, Operational Lessons Learned, Governance Recommendations, Adoption Success Stories, Risk Mitigation Practices

## Approval workflow

Draft → Review → Governance Check → Publication → Community Rating

## Scores (0–100)

| Score | Purpose |
|-------|---------|
| Collective Contribution Score | Quality and usefulness of shared intelligence |
| Community Health Score | Strength and sustainability of the intelligence ecosystem |

## Score factors

Community usefulness, validation quality, adoption impact, governance compliance, participation, knowledge quality, contribution diversity

## Integrations

- **Knowledge Center** — enriches FAQs, best practices, and playbooks
- **Global Learning Network** — pattern recognition and industry guidance
- **Marketplace** — pack reviews and implementation experiences
- **Strategic Intelligence** — common opportunities and shared challenges
- **Human Success** — onboarding patterns and adoption accelerators
- **Executive Briefing** — `generate_community_briefing()`

## Safety guarantees

- Voluntary participation with opt-out
- Anonymization before publication
- No confidential or proprietary sharing without approval
- Governance review required
- No social media feeds or public rankings

## RPCs

- `get_community_intelligence_dashboard()` — Community Hub
- `get_community_intelligence_admin()` — Admin dashboard
- `get_community_intelligence_card()` — summary card
- `submit_community_contribution(type, title, description)` — create contribution
- `review_community_contribution(id, decision, notes)` — moderation/governance
- `rate_community_contribution(id, rating)` — community rating
- `generate_community_briefing()` — executive briefing
