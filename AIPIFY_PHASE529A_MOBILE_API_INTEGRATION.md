# AIPIFY – PHASE 529A
## MOBILE API, PUSH CONTROL & EXTERNAL NOTIFICATION INTEGRATION

**Aipify Group AS** · Bergen. Norway. For the world.

**Feature owner:** CUSTOMER APP

## Purpose

Extend the Phase 529 Notification Engine so APP organizations can connect existing mobile APIs, push systems, SMS providers, internal apps, and external notification systems — with strict anti-spam controls.

## Core principle

Aipify may connect to external mobile and notification systems. Aipify must never send notifications in tide og utide. The right message must go to the right person at the right time.

## Route

| Surface | Route |
|---------|-------|
| Mobile API Integration Center | `/app/integrations/mobile-api` |

## Database

**Migration:** `supabase/migrations/20261852910000_mobile_api_push_external_notification_integration_phase529a.sql`

**Extends Phase 529:** notification orchestration settings, delivery logs, audit patterns.

**New tables:**
- `organization_mobile_api_settings`
- `organization_mobile_api_channels`
- `organization_mobile_api_event_rules`
- `organization_mobile_api_pending_sends`
- `organization_mobile_api_delivery_logs`
- `organization_mobile_api_audit_logs`

**RPCs:**
- `get_mobile_api_integration_center(p_section)`
- `perform_mobile_api_integration_action(p_action_type, p_payload)`
- `get_companion_mobile_api_integration_context(p_query)`
- `_ntf529a_evaluate_delivery()` — rate limits, quiet hours, priority filtering, approval gates

**Permissions:** `notifications.view` / `notifications.manage` (Phase 529)

## App layer

- `lib/mobile-api-integration/`
- `components/app/mobile-api-integration/MobileApiIntegrationPanel.tsx`
- `app/api/app/mobile-api-integration/*`
- `app/api/assistant/mobile-api-integration-context`

## Sections

Overview · Channels · Control Rules · Event Rules · Approvals · Test Mode · Payload Mapping · Reports · History

## Connection types

REST API · Webhook · OAuth · API Key · Bearer Token · Custom Headers · Signed Webhooks

**Modes:** read-only · send · test

## Control rules

Rate limits · Quiet hours · Priority filtering · Recipient rules · Event rules · Approval rules · Fallback rules · Daily limits

## Integrations

- **Phase 529 Notification Engine** — shared notification storage and preferences
- **Business Packs** — `business_pack_key` on channels and event rules
- **Domain awareness** — `domain_id` scoping on channels
- **Companion** — explain rules, pause non-critical, summarize alerts
- **Mobile Access** — external delivery via connected channels

## Acceptance criteria

- ✅ Mobile API Integration Center created
- ✅ External notification channels supported
- ✅ Webhook support created
- ✅ API key and OAuth support prepared
- ✅ Rate limiting created
- ✅ Quiet hours created
- ✅ Priority filtering created
- ✅ Recipient rules created
- ✅ Event rules created
- ✅ Approval rules created
- ✅ Fallback rules created
- ✅ Test mode created
- ✅ Payload mapping created
- ✅ Deep links supported (event rule templates)
- ✅ Domain awareness added
- ✅ Business Pack awareness added
- ✅ Companion integration created
- ✅ User preferences created (via Phase 529 preferences + channel controls)
- ✅ Audit logging created
- ✅ Reporting created

## Final principle

Aipify may connect to any approved notification system — but Aipify must be polite. No spam. No uncontrolled broadcasts. No endless retries. Notify only when it matters.
