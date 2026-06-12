# Sales Expert Marketing Center — FAQ (Phase 33 Extension)

## What is the Marketing Center tab?

**Phase 33 Extension — Marketing Center** adds a **Marketing** tab to the Sales Expert Operating System at `/app/sales-expert-engine`. It provides personal tracking links, banner embed codes, ready-made promotional copy, channel guidance, and metadata performance tracking — tenant-scoped, no PII in dashboard RPCs.

## How is this different from Email Center?

**Email Center** provides one-to-one email templates. **Marketing Center** provides tracking links, banner HTML embeds, promotional text packs, social/forum/email copy examples, and link performance counts. Both explicitly **do not support mass unsolicited outreach**.

## What personal tracking links are available?

| Pattern | Purpose |
|---------|---------|
| `aipify.ai/partner/{slug}` | Partner program link |
| `aipify.ai/sales/{slug}` | Sales Expert link |
| `aipify.ai/?ref={slug}` | Referral parameter link |

Your slug is scaffolded from organization Sales Expert settings metadata.

## What banner sizes are supported?

Four standard sizes: **728×90**, **300×250**, **1080×1080**, **1080×1920**. Each includes copyable HTML with your expert tracking URL auto-inserted. Banner image URLs are illustrative KC/static scaffolds until approved partner assets ship.

## Are promotional texts localized?

**Yes.** Text packs are available in **en, no, sv, da**. Locale follows your marketing settings `preferred_locale` when set.

## Can I send mass marketing emails through this tab?

**No.** Mass unsolicited outreach is explicitly **not supported** — same boundary as the Sales Expert Email Center and Sales Expert OS philosophy.

## What terminology should I use publicly?

Use **Sales Representative**, **Sales Expert**, or **Aipify Expert Partner** — never **Affiliate** publicly.

## How is performance tracked?

Metadata counts only: link clicks, leads, signups, subscriptions, best banner/channel, estimated commission scaffold. No visitor PII stored in marketing dashboard RPCs.

## How does this connect to Sales Coach?

Companion examples (🌹🦉🔔❤️) encourage sustainable, helpful marketing — cross-link to Coach & Certification tabs (Phase 45/46) for daily coaching context.

## Where is the implementation documented?

See [SALES_EXPERT_MARKETING_CENTER.md](../../../../SALES_EXPERT_MARKETING_CENTER.md) and migration `20260993000000_sales_expert_marketing_center_phase33_extension.sql`.
