# Community & Collective Intelligence Engine — Phase 89

## Core principle

**Organizations own their knowledge. Organizations control participation.**

Collective Intelligence strengthens trust — it does not compromise it.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `20260618100000_community_collective_intelligence_phase89.sql` |
| Refinement | `20260618200000_community_collective_intelligence_refinement_phase89.sql` |
| Lib | `lib/aipify/community-intelligence/` |
| API | `/api/aipify/community-intelligence/*` |
| UI | `/app/community` — Community Hub; `/app/community/admin` — Community Dashboard |
| KC | `content/knowledge/aipify/community/` |

## Database tables

- `community_contributions` — category, workflow status, anonymized published content
- `community_reviews` — moderation and governance decisions
- `community_ratings` — usefulness ratings (1–5)
- `community_scores` — tenant score history
- `community_health_scores` — view aligned to spec (`health_score`, `intelligence_score`)
- `community_briefings`, `community_settings`, `community_audit_log`

## Contribution categories

Knowledge, Operational, Governance, Customer Success, Industry, Marketplace

## Approval workflow

Draft → Internal Review → Governance Validation → Anonymization Check → Publication Approval → Community Availability

## Scores (0–100)

| Score | Purpose |
|-------|---------|
| Collective Intelligence Score | Usefulness, quality, validation, relevance of contributions |
| Community Health Score | Sustainability of the intelligence ecosystem |

## Hub sections

Featured Learnings, Best Practices, Recently Validated Contributions, Blueprint Recommendations, Industry Insights, Popular Resources

## Admin dashboard

Pending Reviews, Governance Queue, Contribution Trends, Health Score, Intelligence Categories, Participation Insights

## Integrations

Learning Engine, Knowledge Center, Global Learning Network, Marketplace, Strategic Intelligence, Human Success, Executive Briefing

## Safety guarantees

- Opt-in participation only
- Enhanced anonymization engine
- No automatic publication
- Governance and audit on every contribution

## RPCs

- `get_community_intelligence_dashboard()` — Community Hub
- `get_community_intelligence_admin()` — Community Dashboard
- `get_community_intelligence_card()` — summary card
- `submit_community_contribution()`, `review_community_contribution()`, `rate_community_contribution()`
- `generate_community_briefing()` — executive briefing
