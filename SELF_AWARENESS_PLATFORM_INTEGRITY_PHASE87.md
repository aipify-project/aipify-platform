# Self-Awareness & Platform Integrity Engine — Phase 87

## Core principle

**Aipify evaluates itself. Humans govern improvements.**

Integrity is not a feature — it is part of Aipify's identity.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260617900000_self_awareness_platform_integrity_phase87.sql` |
| Lib | `lib/aipify/platform-integrity/` |
| API | `/api/aipify/platform-integrity/*` |
| UI | `/app/integrity` — Platform Integrity Dashboard |
| KC FAQ | `content/knowledge/aipify/integrity/faq/platform-integrity-faq.md` |

## Database tables

- `integrity_reviews` — weekly/monthly/quarterly/annual reviews
- `integrity_findings` — domain findings with evidence and governance requirements
- `integrity_scores` — Aipify Integrity Score with component breakdown
- `integrity_actions` — corrective actions with governance gates
- `integrity_deprecated_assets` — flagged assets for review (not auto-removed)
- `integrity_briefings` — executive integrity briefings
- `integrity_settings` — org configuration
- `integrity_audit_log` — audit trail

## Review domains

Knowledge, Support, Marketplace, Blueprint, Recommendation, Explanation, Human Success, Desktop, Strategic Intelligence, Governance

## Aipify Integrity Score (0–100)

| Score | Band |
|-------|------|
| 90–100 | Exceptional Integrity |
| 75–89 | Strong Integrity |
| 60–74 | Integrity Improvements Recommended |
| 40–59 | Integrity Concerns Identified |
| Below 40 | Critical Integrity Review Required |

## Score components

Trust Quality, Knowledge Freshness, Support Effectiveness, Recommendation Accuracy, Customer Value, Experience Consistency, Marketplace Effectiveness, Governance Alignment

## Finding severity levels

Healthy, Monitor, Attention Required, Critical Review Required

## Integrations

- **Learning Engine** — emerging quality issues and corrective patterns
- **Strategic Intelligence** — integrity investment prioritization
- **Outcomes Engine** — failed validation and recommendation quality
- **Human Success** — adoption integrity signals
- **Evolution Governance** — critical proposal backlog detection
- **Trust Engine** — explanation clarity and transparent scoring
- **Knowledge Center** — gap and freshness analysis
- **Executive Briefing** — `generate_integrity_briefing()`

## Safety guarantees

- No concealed quality concerns
- No inflated Integrity Scores
- No autonomous major corrections
- Deprecated assets flagged, never auto-removed
- Governance required for critical actions

## RPCs

- `get_platform_integrity_dashboard()` — main dashboard
- `get_platform_integrity_card()` — summary card
- `acknowledge_integrity_finding(uuid)` — acknowledge finding
- `complete_integrity_action(uuid)` — complete action (governance-gated)
- `generate_integrity_briefing()` — executive briefing
