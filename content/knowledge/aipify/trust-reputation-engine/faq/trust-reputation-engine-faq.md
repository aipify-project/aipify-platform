# Trust & Reputation Engine — FAQ

## What is the Trust & Reputation Engine?

It tracks organizational trust profiles for workflows, automations, approvals, knowledge, support, and governance entities. Reputation is built from metadata-only signals — humans review expansion and may revoke trust.

## How is this different from the legacy Trust Engine?

The legacy Trust Engine at `/app/trust` covers broader platform trust concepts. This engine (A.72) focuses on entity-scoped trust scores, reputation signals, and human-reviewed trust expansion at `/app/trust-reputation-engine`.

## What data is stored?

Only metadata: signal types, numeric scores, entity types, and outcome summaries. No customer emails, chats, orders, or other PII.

## Can trust levels increase automatically?

Scores may update from aggregate signals, but expansion to highly trusted levels requires human review when `expansion_review_required` is enabled (default).

## Are trust actions audited?

Yes. Profile updates, level changes, revocations, signal recording, expansion reviews, and exports are logged via `tre_*` audit actions.
