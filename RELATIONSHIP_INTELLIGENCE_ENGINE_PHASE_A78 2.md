# Relationship Intelligence Engine — Phase A.78

**Feature owner:** Customer App

Organizational relationship context at tenant level — internal, customer, partner, and community. **Distinct from Phase 33 RSI** (personal) at `/app/assistant/relationships`.

## Extends

- Partner Success Engine (A.73)
- Support AI Engine (A.7)
- Organizational Memory Engine (A.34)
- Trust & Reputation Engine (A.72)

## Route

`/app/relationship-intelligence-engine` — nav id `relationshipIntelligenceEngine`

## Tables

- `organization_relationship_profiles` — category, subject_key, display_name, strength, frequency, sentiment (metadata only)
- `organization_relationship_interactions` — interaction_type, summary max 500 chars
- `organization_relationship_insights` — insight_type, recommended_action, confidence, status
- `organization_relationship_intelligence_settings` — org defaults and ethical guardrails

## Permissions

`relationship_intelligence.view` · `relationship_intelligence.manage` · `relationship_intelligence.insights.resolve`

Metadata only — no raw email/chat. Never impersonate or auto-send messages.
