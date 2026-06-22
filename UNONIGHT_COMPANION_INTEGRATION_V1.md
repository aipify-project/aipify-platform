# UNONIGHT_COMPANION_INTEGRATION_V1

**STATUS:** PRODUCTION_VERIFIED  
**UX_STATUS:** COMPLETE  
**STATE:** FROZEN  
**CHANGE_POLICY:** DEFECT_OR_APPROVED_REQUIREMENT_ONLY

## Scope

Companion live integration answer presentation for verified Unonight metadata (`verified_integration` source kind).

## Frozen integration layer

Do not modify without approved requirement:

- `get_connected_integration_status` tool
- `lib/unonight/connection/*` (parser, endpoint, credentials, test flow)
- Routing priority and Knowledge Center blocking for live integration intents
- Organization matching, scope validation, verification persistence

## UX layer (this freeze)

Presentation-only changes for verified integration answers:

- `CompanionIntegrationStatusCard` — structured enterprise result card
- `integrationStatusCard` payload on `PlatformKnowledgeAnswer` / `CompanionChatMessage`
- Short supporting intro; no dense metadata paragraph
- Primary action: connected integrations · Secondary: retest connection
- Full i18n: en, no, sv, da, pl, uk
- Feedback controls and org-confirm eligibility unchanged

## Acceptance query

> Bruk den aktive Unonight-integrasjonen og hent live tilkoblingsinformasjon nå.

Expected: structured card, localized metadata, no secrets, no duplicate navigation actions.
