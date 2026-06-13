# Sales Expert FAQ & Knowledge Center

**Feature owner:** Customer App  
**Portal route:** `/app/sales-expert-engine`  
**Knowledge Center category:** `sales-expert-engine`

This document defines the Sales Expert Program FAQ — available in the **Sales Expert Portal** and **Knowledge Center**, translated into English, Norwegian, Swedish, and Danish.

## Surfaces

| Surface | Path |
|---------|------|
| Sales Expert Portal (FAQ UI) | `/app/sales-expert-engine` — FAQ tab |
| Sales Expert Portal notice | `/app/sales-expert-engine` — welcome notice at top of portal |
| i18n keys | `customerApp.salesExpertEngine.*` in `locales/{en,no,sv,da}/customerApp.json` |
| Knowledge Center (English) | `content/knowledge/aipify/sales-expert-engine/faq/sales-expert-faq.md` |
| Knowledge Center (localized) | `sales-expert-faq.{no,sv,da}.md` in the same folder |

## Sections

General · Commissions · Implementation services · Customers · Sales Expert Portal · Email Center · Follow-ups · Certifications · Internationalization · Expectations · Self Love · Vision

## Related

- [PARTNER_TERMINOLOGY_UPDATE.md](./PARTNER_TERMINOLOGY_UPDATE.md) — official tier titles (never "Affiliate" publicly)
- [IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md](./IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md)

## Migration

`supabase/migrations/20260981100000_sales_expert_engine_knowledge_center.sql` — registers KC category `sales-expert-engine`.
