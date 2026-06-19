# AIPIFY – PHASE 527
## MARKETING, CAMPAIGNS & BRAND OPERATIONS ENGINE

**Aipify Group AS** · Bergen. Norway. For the world.

**Feature owner:** CUSTOMER APP

## Purpose

Universal Marketing & Brand Operations Engine for APP organizations — campaigns, content, channels, assets, audiences, performance, and marketing operations. The marketing execution layer of Aipify.

## Core principle

Marketing should be measurable. Brands should remain consistent. Campaigns should be organized.

## Routes

| Surface | Route |
|---------|-------|
| Marketing Center | `/app/marketing` |
| Campaign Center | `/app/marketing/campaigns` |
| Audience Management | `/app/marketing/audiences` |
| Content Center | `/app/marketing/content` |
| Brand Asset Library | `/app/marketing/assets` |

## Database

**Migration:** `supabase/migrations/20261852700000_marketing_campaigns_brand_operations_engine_phase527.sql`

**Tables:**
- `organization_marketing_settings`
- `organization_marketing_campaigns`
- `organization_marketing_audiences`
- `organization_marketing_content`
- `organization_marketing_assets`
- `organization_marketing_channels`
- `organization_marketing_calendar_events`
- `organization_marketing_partner_materials`
- `organization_marketing_audit_logs`

**RPCs:**
- `get_marketing_brand_operations_center(p_section)`
- `perform_marketing_brand_operations_action(p_action_type, p_payload)`
- `get_companion_marketing_brand_operations_context(p_query)`
- `get_my_marketing_brand_operations_summary()`

**Module:** `marketing` · permissions `marketing.view` / `marketing.manage`

## App layer

- `lib/marketing-brand-operations/` — types, parse, labels, RPC wrappers
- `components/app/marketing-brand-operations/MarketingBrandOperationsPanel.tsx`
- `app/api/app/marketing-brand-operations/*`
- `app/api/assistant/marketing-brand-operations-context`

## Integrations

- **Growth Partner:** partner materials with mandatory unique referral links (PARTNERS layer separate)
- **Domain:** per-domain and organization-wide scoping via `domain_id`
- **Business Packs:** `business_pack_key` on campaigns, content, assets
- **Calendar:** marketing calendar events table (Calendar Engine integration ready)
- **Companion:** context API for active campaigns, attention items, audience growth

## Acceptance criteria

- ✅ Marketing Center created
- ✅ Campaign Center created
- ✅ Audience Management created
- ✅ Content Center created
- ✅ Brand Asset Library created
- ✅ Channel Management created
- ✅ Marketing Calendar created
- ✅ Performance Tracking created
- ✅ Growth Partner Integration created
- ✅ Brand Governance created
- ✅ Companion Integration created
- ✅ Domain Integration created
- ✅ Reporting created
- ✅ Executive Dashboard (overview metrics in center RPC)
- ✅ Mobile Access supported
- ✅ Audit Logging created

## Final principle

Marketing creates awareness. Relationships create trust. Trust creates customers.

One Marketing Engine. One Brand Operations Layer. Unlimited Organizations. Unlimited Business Packs.

**END OF PHASE 527**
