# Growth Partner Operations Center Engine — Phase 114

## Vision

**We gained a trusted Growth Partner who helped our organization succeed — not just software we purchased alone.**

## Philosophy

Growth Partners are independent businesses (NOT affiliates). Strategy, implementation, training, change management, customer success, advisory. Growth through support. People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Stewardship through responsibility.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261204000000_growth_partner_operations_center_engine_phase114.sql` |
| Blueprint | `IMPLEMENTATION_BLUEPRINT_PHASE114_GROWTH_PARTNER_OPERATIONS_CENTER.md` |
| Lib | `lib/aipify/growth-partner-operations/` |
| API | `/api/aipify/growth-partner-operations/dashboard`, `/api/aipify/growth-partner-operations/card` |
| UI | `/app/growth-partner-operations` |
| KC FAQ | `content/knowledge/aipify/growth-partner-operations/faq/growth-partner-operations-center-faq.md` |

## Role

Distinct operational workspace for Growth Partners — manage customer portfolio, implementations, training, renewals, partner health, and marketplace integration. **NOT** an extension of `/app/partners` certification RPCs.

## RPC prefixes

- Baseline: `_gpoc_*`
- Blueprint: `_gpocbp114_*` (never collides with `_pce_*`, `_gpebp107_*`, `_pse_*`)

## Operations Center modules (11)

Partner Dashboard · Customer Portfolio · Implementation Center · Companion Deployment Center · Training Academy · Renewal Center · Success Monitoring · Knowledge Distribution · Revenue Intelligence · Partner Insights

## Implementation stages (10)

Discovery → Planning → Configuration → Companion Setup → Knowledge Preparation → Pilot Deployment → User Training → Go Live → Optimization → Continuous Success

## Certification framework (6 levels)

Registered · Certified · Advanced · Strategic · Enterprise · Global Growth Partner — mapped to `_pce_tier_label()` without renaming DB seeds.

## Distinction cross-links

| Surface | Route | Relationship |
|---------|-------|--------------|
| Partner Certification Phase 91 + Blueprint 107 | `/app/partners` | Certification & ecosystem — cross-link NOT duplicate |
| Partner Success A.73 | `/app/partner-success-engine` | Portfolio health — complementary |
| Companion Marketplace Phase 113 | `/app/companion-marketplace` | Companion deployment cross-link |
| Marketplace Blueprint 112 | `/app/marketplace` | Partner offerings |
| Marketplace Partner Ecosystem A.45 | `/app/marketplace-partner-ecosystem-foundation-engine` | Ecosystem foundation |
| Customer Lifecycle Phase 86 / Blueprint 108 | `/app/customer-lifecycle` | Customer journey |
| Certification & Achievement A.37 | `/app/certification-achievement-engine` | Internal certs distinct |
| Learning & Training A.36 | `/app/learning-training-engine` | Training cross-link |
| Sales Expert OS A.79 | `/app/sales-expert-engine` | Sales Expert as Growth Partner type |
| Two-Factor Authentication | `/app/settings/two-factor` | Mandatory 2FA for sensitive roles |

## Security

RBAC, customer access segmentation, audit logging, activity monitoring, data isolation, mandatory 2FA for sensitive roles, QR enrollment, recovery codes, session visibility — cross-link `20261202000000_two_factor_authentication_system.sql`.

## Privacy

Metadata only — no customer email, chat, or PII in partner operations tables. Communication history is counts only.

## Success metrics (9)

Higher retention · Improved implementations · Greater satisfaction · Expanded ecosystem · Increased adoption · Stronger governance · Healthier relationships · Sustainable partner businesses · Improved transformation outcomes
