# Implementation Blueprint — Phase 43: Sales Engagement & Booking Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Engagement & Booking**

> **Mapping:** Blueprint Phase 43 extends **Sales Expert OS A.95** — personal booking pages, calendar sync scaffold, follow-up engagement, meeting prep, and engagement history. Cross-links Context Engine calendars, Coach Phase 45/46, Unified Tasks A.62, Meeting Collaboration A.61, Self Love A.76 — never duplicates.

## Mission

Help Sales Experts schedule meetings professionally, follow up consistently, and prepare thoughtfully — **trust through consistency**.

## Core philosophy

**Follow-up demonstrates professionalism.** Booking should feel personal and respectful — never pressure or mass outreach.

## ABOS principle

Aipify Business Operating System (ABOS) partners build trust through prepared, consistent engagement — humans decide; Aipify informs and prepares.

## Objectives

| Key | Focus |
|-----|-------|
| **Meeting scheduling** | Personal booking pages at `aipify.ai/book/{slug}` |
| **Demo booking** | Discovery and demonstration sessions — install-first positioning |
| **Follow-ups** | Companion nudges 🌹🔔🦉 from existing `organization_sales_expert_follow_ups` |
| **Meeting prep** | Customer background summaries, industry context, discovery questions — metadata scaffold |
| **Engagement tracking** | Meeting history, notes metadata, action items, upcoming sessions |
| **Calendar sync** | Google, Outlook, Apple — conflict avoidance metadata; honest pending/OAuth status |

## Booking center

Personal pages: **`https://aipify.ai/book/{slug}`**

Session types:

- Discovery meeting (45 min)
- Product demonstration (60 min)
- Onboarding consultation (60 min)
- Follow-up consultation (30 min)

Extends existing `organization_sales_expert_settings.booking_link` and email template `booking_link` placeholder — do not duplicate.

## Calendar integrations (scaffold)

| Provider | OAuth status | Note |
|----------|--------------|------|
| Google Calendar | pending | Conflict avoidance metadata only |
| Microsoft Outlook | pending | Honest status until authorization completes |
| Apple Calendar | pending | Cross-link Context Engine at `/app/assistant/calendars` |

Aipify orchestrates calendars — **never replaces them**.

## Discovery meetings

Discovery-first prep scaffold:

- Review customer org name and pipeline stage metadata
- Prepare industry-aware discovery questions from Coach tab
- Confirm duration and timezone
- Send `booking_link` in one-to-one email when appropriate

## Demonstration bookings

Demo types: **support** · **executive** · **commerce** · **community**

Cross-links Sales Demo pipeline (`pipeline_stage = demo` on opportunities) and Coach demonstration guidance.

## Follow-up management

Companion nudges leverage `organization_sales_expert_follow_ups` counts:

- 🌹 Thoughtful follow-up suggestions
- 🔔 Scheduled reminder awareness
- 🦉 Meeting prep suggestions before demos

## Meeting preparation

Metadata scaffold sections:

- Customer background (`notes_metadata`)
- Industry context
- Discovery questions (Phase 45)
- Demo pathways (Phase 43)

Cross-links Unified Tasks A.62 and Meeting Collaboration A.61.

## Engagement history

Live from `_sebbp_engagement_history(organization_id)`:

- Upcoming bookings
- Recent completed bookings (90 days)
- Upcoming follow-ups
- Open opportunities count

## Self Love connection (A.76)

Sustainable engagement pacing — back-to-back meetings without recovery is not success.

Route: `/app/self-love-engine`

## Trust connection

Experts should understand:

- Honest calendar OAuth pending status
- Metadata-only meeting prep — no raw email or chat
- Follow-up counts from follow_ups table — nudges suggest only
- Booking notes field empty in scaffold — no customer PII
- Regional date/time via locale and per-booking timezone metadata

## Distinctions

| Surface | Route | Purpose |
|---------|-------|---------|
| Coach Phase 45/46 | `/app/sales-expert-engine` | Daily coaching and demo guidance |
| Email Center | `/app/sales-expert-engine` | One-to-one templates with `booking_link` |
| Context Engine | `/app/assistant/calendars` | Personal calendar layer — not replacement |
| Sales Expert OS A.95 | `/app/sales-expert-engine` | **Phase 43 Engagement & Booking tab** |

## Database

Migration: `supabase/migrations/20260995000000_implementation_blueprint_phase43_sales_engagement_booking.sql`

**Tables:**

- `organization_sales_expert_settings` — extended with `booking_slug`, `booking_page_enabled`
- `organization_sales_expert_bookings` — metadata: `booking_type`, `scheduled_at`, `duration_minutes`, `status`, `timezone` — notes empty scaffold

**RPCs:** `_sebbp_*` helpers; `_sebbp_engagement_summary(organization_id)`; extends `get_sales_expert_operating_system_dashboard()` and card RPC.

## UI

- `components/app/sales-expert-engine/EngagementBookingTab.tsx` — **Engagement & Booking** tab
- Copy booking URL · show follow-ups from dashboard sections
- Types: `lib/aipify/sales-expert-operating-system/types.ts`, `parse.ts`
- i18n: `customerApp.salesExpertEngine.tabEngagement` + section labels in en/no/sv/da

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase43-sales-engagement-booking.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase43-vocabulary.ts`

## Related docs

- [IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md](./IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md)
- [IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md](./IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md)
- [CONTEXT_ENGINE.md](./CONTEXT_ENGINE.md)
- FAQ: `content/knowledge/aipify/sales-expert-engine/faq/implementation-blueprint-phase43-faq.md`
