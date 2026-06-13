# Sales Expert Marketing Center

**Feature owner:** CUSTOMER APP  
**Engine:** Sales Expert Operating System (Phase A.95)  
**Route:** `/app/sales-expert-engine` — **Marketing** tab  
**Migration:** `supabase/migrations/20260993000000_sales_expert_marketing_center_phase33_extension.sql`

## Purpose

Equip Aipify Sales Experts with ethical marketing tools: personal tracking links, banner embed codes, ready-made promotional copy, channel guidance, and metadata performance tracking — without mass unsolicited outreach or PII in dashboard RPCs.

## Architecture

| Layer | Path |
|-------|------|
| Customer App UI | `components/app/sales-expert-engine/MarketingCenterTab.tsx` |
| Types / parse | `lib/aipify/sales-expert-operating-system/` |
| Core RPCs | `_seosmc_*` helpers in migration |
| ILM | `lib/internal-language-model/sales-expert-marketing-center-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/sales-expert-engine/faq/sales-expert-marketing-center-faq.md` |

## Database

### `sales_expert_marketing_settings`

- `tracking_slug` — slug for personal links
- `preferred_locale` — `en` | `no` | `sv` | `da`
- `tracking_enabled` — boolean

### `sales_expert_marketing_events`

Metadata counts only: `click`, `lead`, `signup`, `subscription` — no PII.

Access via security definer RPCs (`_seosmc_*`); tables revoked from direct authenticated access (consistent with SEOS pattern).

## Dashboard RPC

`get_sales_expert_operating_system_dashboard()` returns `sales_expert_marketing_center` object:

- `mission`, `features`, `personal_links`, `banners`
- `promotional_text_packs` (locale-aware)
- `channel_guidance`, `forum_guidelines`, `video_ideas`
- `coach_marketing_connection`, `performance_tracking`
- `self_love`, `trust`, `success_criteria`, `vision`

**All A.95 + Phase 41 + 45 + 46 fields preserved.**

## Personal tracking links

| Pattern | Example |
|---------|---------|
| `aipify.ai/partner/{slug}` | Partner program link |
| `aipify.ai/sales/{slug}` | Sales Expert link |
| `aipify.ai/?ref={slug}` | Referral parameter |

Tracks: leads, signups, subscriptions, customer source, commission eligibility (metadata counts).

## Banner embed codes

Four sizes with auto-inserted expert link and banner URL:

- 728×90, 300×250, 1080×1080, 1080×1920

Banner image URLs are illustrative KC/static asset scaffolds — document as placeholders until approved partner assets ship.

## Localization

Promotional text packs and UI in **en, no, sv, da**. Locale from `sales_expert_marketing_settings.preferred_locale`, else `en`.

## Cross-links

- **Sales Coach** Phase 45/46 — companion marketing examples (🌹🦉🔔❤️)
- **Performance** Phase 41 — milestone and commission context
- **Partner Ecosystem** A.45 — certified partner program
- **Global Expansion** Phase 35 — localization engine
- **Self Love** A.76 — sustainable marketing, one channel at a time

## Design rules

1. **Never "Affiliate" publicly** — use Sales Representative / Sales Expert terminology
2. **Mass unsolicited outreach NOT supported** — consistent with Sales Expert OS Email Center
3. **Metadata only** — no PII in marketing dashboard RPCs
4. **Honest representation** — Aipify supports, does not replace; customers subscribe directly to Aipify
5. **i18n required** — `customerApp.salesExpertEngine.marketing*`

## Distinction

Distinct from **Email Center** (one-to-one templates) and **Partner Resources** (KC asset metadata). Marketing Center provides tracking links, embeds, copy packs, and performance counts in a dedicated tab.

## Card RPC extension

`get_sales_expert_operating_system_card()` adds:

- `marketing_link_clicks`, `marketing_signups`, `marketing_subscriptions`
- `marketing_brief_summary`

## Success criteria

Live via `_seosmc_blueprint_success_criteria()` — tracking links, banners, promotional packs, channel guidance, forum guidelines, coach connection, performance scaffold, Self Love, trust, localization.

## Related documentation

- [IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md](./IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md)
- [SALES_EXPERT_FAQ_KNOWLEDGE_CENTER.md](./SALES_EXPERT_FAQ_KNOWLEDGE_CENTER.md)
- [INTERNAL_LANGUAGE_MODEL.md](./INTERNAL_LANGUAGE_MODEL.md)
