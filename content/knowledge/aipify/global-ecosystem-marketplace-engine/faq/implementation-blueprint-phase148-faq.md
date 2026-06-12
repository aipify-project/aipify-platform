# Global Ecosystem Marketplace Engine — FAQ (Phase 148)

## What is the Global Solution Marketplace?

The Global Solution Marketplace at `/app/global-ecosystem-marketplace-engine` is a **professional enterprise solution exchange** within the Global Intelligence Era (141–150). It enables governed discovery of playbooks, frameworks, templates, and Growth Partner offerings — **not** a consumer app store.

## How is Phase 148 different from the Skills Marketplace (Phase 112)?

The Skills Marketplace (`/app/marketplace`) provides **skills and extensions** via `_mkp_*` / `_sembp112_*` RPCs. Phase 148 is a **governed solution exchange** for enterprise playbooks, frameworks, and procurement metadata — cross-link only, **do not duplicate** marketplace catalog tables.

## How is Phase 148 different from the Companion Marketplace (Phase 113)?

Companion Marketplace (`/app/companion-marketplace`) is the **digital employee catalog**. Phase 148 cross-links companion skills as a category but does not duplicate `_cmpm_*` companion catalog RPCs.

## Is participation mandatory?

**No.** New tenants default to **opt-out** (`enabled = false`). Organizations must explicitly enable participation before publishing or browsing shared solution metadata.

## What may be listed?

Approved **metadata summaries** only: solution keys, categories, industry tags, validation status, procurement metadata — max 500 characters per summary. No raw customer content.

## What must never be listed?

PII, raw emails, chats, orders, financial records, proprietary secrets, or operational customer records.

## Does the Marketplace Companion override procurement?

**No.** The Marketplace Companion supports discovery and implementation preparation. It does **not** guarantee outcomes, unfairly prioritize listings, manipulate visibility, suppress competing approaches, or override procurement judgment.

## What are the permissions?

| Permission | Purpose |
|------------|---------|
| `global_ecosystem_marketplace.view` | View marketplace center and catalog metadata (when opted in) |
| `global_ecosystem_marketplace.manage` | Update settings and review validations |
| `global_ecosystem_marketplace.contribute` | Submit solution listings for governance review |

## Which surfaces does Phase 148 cross-link?

| Surface | Route |
|---------|-------|
| Skills Marketplace 112 | `/app/marketplace` |
| Companion Marketplace 113 | `/app/companion-marketplace` |
| Marketplace Governance 90 | `/app/marketplace-governance` |
| Module Marketplace A.23 | `/app/module-marketplace-foundation-engine` |
| Ecosystem Governance 119/146 | `/app/ecosystem-governance` |
| Global Talent 147 | `/app/global-talent-expert-network-engine` |
| Growth Partner Ops 114 | `/app/growth-partner-operations` |
| Partners 91 | `/app/partners` |
| Knowledge Exchange 141 | `/app/global-knowledge-exchange-engine` |

## Growth Partner or Affiliate?

**Growth Partner** — never Affiliate. People First. Growth through support.
