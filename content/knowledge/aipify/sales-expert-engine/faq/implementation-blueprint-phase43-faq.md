# Sales Engagement & Booking — FAQ (Phase 43)

## What is the Engagement & Booking tab?

**Blueprint Phase 43** adds an **Engagement & Booking** tab to the Sales Expert Operating System at `/app/sales-expert-engine`. It provides personal booking pages, follow-up engagement, meeting preparation scaffolds, calendar integration metadata, and engagement history — tenant-scoped, metadata only.

## How is this different from the Coach tab (Phase 45)?

**Phase 45** focuses on daily coaching, demo guidance, and activity recommendations. **Phase 43** focuses on scheduling, booking URLs, follow-up counts, calendar sync scaffold, and engagement history. Coach cross-links meeting prep — Phase 43 does not duplicate coaching content.

## What is my booking page URL?

Your personal booking page follows **`https://aipify.ai/book/{slug}`**. The slug derives from your Sales Expert settings (`booking_slug`) or display name. Copy the URL from the Engagement tab. This extends your existing `booking_link` used in email templates.

## Are calendar integrations live?

**Not yet.** Google, Outlook, and Apple calendar connections show **honest pending OAuth status** until authorization completes. Aipify orchestrates calendars via Context Engine — it does not replace your calendar app. Cross-link: `/app/assistant/calendars`.

## How do follow-ups work with engagement?

Phase 43 surfaces counts and companion nudges 🌹🔔🦉 from the existing **`organization_sales_expert_follow_ups`** table and Email Center cadences. Nudges suggest — you decide timing and content.

## What data is stored for bookings?

Booking metadata only: type, scheduled time, duration, status, timezone. The **notes field remains empty** in the scaffold — no customer PII or conversation content stored.

## How does meeting preparation work?

Meeting prep scaffolds customer background from `notes_metadata`, industry context, discovery questions (Coach tab), and demo pathways. Metadata only — no raw email or chat content.

## How does Self Love connect?

Engagement can be demanding. Phase 43 cross-links **Self Love A.76** at `/app/self-love-engine` for sustainable meeting and follow-up pacing.

## Where is the implementation documented?

See [IMPLEMENTATION_BLUEPRINT_PHASE43_SALES_ENGAGEMENT_BOOKING.md](../../../../IMPLEMENTATION_BLUEPRINT_PHASE43_SALES_ENGAGEMENT_BOOKING.md) and migration `20260995000000_implementation_blueprint_phase43_sales_engagement_booking.sql`.
