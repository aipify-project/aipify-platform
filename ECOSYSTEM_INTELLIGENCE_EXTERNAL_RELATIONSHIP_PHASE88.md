# Ecosystem Intelligence & External Relationship Engine — Phase 88

## Core principle

**Aipify maps relationships. Humans govern relationships.**

Organizations do not operate in isolation. Ecosystem Intelligence helps understand external dependencies, risks, and opportunities.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260618000000_ecosystem_intelligence_external_relationship_phase88.sql` |
| Lib | `lib/aipify/ecosystem-intelligence/` |
| API | `/api/aipify/ecosystem-intelligence/*` |
| UI | `/app/ecosystem` — Ecosystem Intelligence Dashboard |
| KC FAQ | `content/knowledge/aipify/ecosystem/faq/ecosystem-intelligence-faq.md` |

## Database tables

- `ecosystem_relationships` — relationship maps with category, importance, dependency level
- `ecosystem_dependencies` — integration, workflow, infrastructure dependencies
- `ecosystem_risks` — external risk detection with mitigation recommendations
- `ecosystem_opportunities` — partnership and diversification opportunities
- `ecosystem_scores` — Ecosystem Health Score with component breakdown
- `relationship_owners` — primary, secondary, and continuity contacts
- `ecosystem_briefings` — executive ecosystem briefings
- `ecosystem_settings` — intelligence and consent configuration
- `ecosystem_audit_log` — audit trail

## Relationship categories

Customers, Partners, Suppliers, Technology Providers, Regulatory Bodies, Consultants, External Developers, Community Contributors (plus custom)

## Ecosystem Health Score (0–100)

| Score | Band |
|-------|------|
| 90–100 | Highly Resilient Ecosystem |
| 75–89 | Healthy Ecosystem |
| 60–74 | Improvement Opportunities |
| 40–59 | Ecosystem Risk Concerns |
| Below 40 | Critical Ecosystem Vulnerabilities |

## Score components

Dependency Diversity, Relationship Quality, Integration Stability, Partner Value Contribution, Supplier Resilience, External Risk Exposure, Strategic Alignment

## Integrations

- **Digital Twin** — external dependencies and cross-boundary workflows
- **Continuity Engine** — supplier failures and backup relationship planning
- **Strategic Intelligence** — ecosystem opportunities and diversification
- **Marketplace** — partner and Business Pack relationship mapping
- **Value Engine** — partner and supplier value contribution
- **Risk Engine** — external exposure and concentration risks
- **Executive Briefing** — `generate_ecosystem_briefing()`

## Safety guarantees

- No unauthorized external monitoring
- Transparency and consent mandatory
- No autonomous relationship commitments
- Human governance for all strategic relationships
- Privacy obligations enforced

## RPCs

- `get_ecosystem_intelligence_dashboard()` — main dashboard
- `get_ecosystem_intelligence_card()` — summary card
- `generate_ecosystem_briefing()` — executive briefing

## Review frequencies

- **Monthly** — monitor ecosystem changes
- **Quarterly** — assess strategic alignment
- **Annual** — evaluate long-term resilience
