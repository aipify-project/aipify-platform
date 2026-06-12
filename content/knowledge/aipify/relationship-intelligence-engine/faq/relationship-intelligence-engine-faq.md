# Relationship Intelligence Engine — FAQ

## What is the Relationship Intelligence Engine?

It helps organizations understand relationships within and around the business — internal teams, customers, partners, and communities — using metadata-only context. Aipify informs; humans decide.

## How is this different from personal RSI at /app/assistant/relationships?

Phase 33 RSI is **personal** — important people, birthdays, and follow-ups for individual users via PAME. Phase A.78 is **organizational** — tenant-level relationship profiles for support, management, and executive use. They are separate engines and must not be merged.

## What relationship categories are supported?

Four categories: **internal** (employees, teams, managers), **customer** (accounts and stakeholders), **partner** (implementation and advisory relationships), and **community** (ecosystem and public stakeholders).

## Does Aipify store raw emails or chat content?

No. Interaction summaries are metadata only, capped at 500 characters. Raw customer email, chat, and conversation content are prohibited.

## Can Aipify send messages on behalf of the organization?

Never. Aipify must not impersonate users or auto-send messages. Recommended actions are suggestions for humans to review and execute.

## What ethical boundaries apply?

No manipulation, no pressure tactics, no impersonation, and no conflation with personal RSI data. Trust indicators are illustrative signals — not judgments about people. Self Love monitors relational health gently without guilt.

## How does this integrate with Support AI and Partner Success?

Customer relationship profiles inform Support AI triage context. Partner profiles link to Partner Success Engine (A.73) for adoption and renewal readiness. All integration links are metadata-only scaffolds.

## Who can resolve relationship insights?

Users with `relationship_intelligence.insights.resolve` permission can acknowledge, resolve, or dismiss insights. Owners, administrators, and managers receive this by default.

## Is relationship data audited?

Yes. Profile updates, insight creation, insight resolution, and manifest exports are recorded via `rie_*` audit actions.

## Does Self Love monitor organizational relationships?

Self Love (A.76 planned) will monitor relational health across the organization — gentle signals when collaboration patterns need attention, never pressure or guilt.
