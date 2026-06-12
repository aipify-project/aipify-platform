# Cross-Organizational Collaboration & Joint Operations Engine — FAQ

## What is the Joint Operations Center?

The **Cross-Organizational Collaboration & Joint Operations Engine (Phase 143)** at `/app/joint-operations-engine` is Aipify's center for secure interorganizational collaboration. It provides governed partnership records, cross-org shared workspace scaffolds, joint objectives, and collaboration audit metadata — while organizations remain autonomous.

## How is this different from Organization & Workspace Engine (A.75)?

A.75 at `/app/organization-workspace-engine` manages **single-tenant internal workspaces**. Phase 143 is **cross-organizational shared workspaces** with participating org IDs and partnership governance. Cross-link only — do not duplicate `_owe_*` RPCs.

## How is this different from Global Knowledge Exchange (Phase 141)?

Phase 141 at `/app/global-knowledge-exchange-engine` is **voluntary governed knowledge exchange** with anonymized benchmarks. Phase 143 is **operational collaboration** — partnerships, shared workspaces, and joint objectives. Cross-link only — do not duplicate `_gkee_*` or `_gkeebp141_*` RPCs.

## How is this different from Trust Network (Phase 142)?

Phase 142 extends **Trust & Reputation** at `/app/trust-reputation-engine` with verified organization ecosystem signals. Phase 143 focuses on **joint operations and shared workspace governance**. Cross-link only.

## Do companions replace relationship management?

**No.** Companions support coordination — knowledge summaries, meeting prep, action tracking, and status reporting. **Humans remain accountable** for relationships, partnerships, and governance decisions. Cross-link Relationship Intelligence A.78 at `/app/assistant/relationships`.

## What partner types are supported?

Five types: Growth Partner, organization, consultant, supplier, and advisory. Growth Partner terminology — **never Affiliate**.

## What governance tiers exist?

`standard`, `elevated`, and `executive`. Executive approval is required by default before partnerships and shared workspaces activate.

## What permissions are required?

- `joint_operations.view` — view Joint Operations dashboard and metadata
- `joint_operations.manage` — configure settings and partnership/workspace scaffolds (owner/administrator)
- `joint_operations.collaborate` — participate in shared workspaces (owner/administrator/manager)

## Is collaboration opt-in?

**Yes.** Joint operations default to disabled (`enabled = false`). Organizations must explicitly enable collaboration and approve participation agreements.

## What data is stored?

Metadata only — partnership summaries, workspace scaffolds, objective metadata, and collaboration audit logs. No raw email, chat, orders, financial records, or cross-tenant confidential content without explicit governed partnership link.

## Where does Self Love connect?

Phase 143 cross-links **Self Love A.76** at `/app/self-love-engine` for respect, patience, generosity, listening, recognition, and shared success in collaboration.

## Where do Trust Actions connect?

Sensitive joint actions cross-link **Trust & Action Phase 30** at `/app/approvals` for explicit human approval.
