# Context Intelligence Engine — FAQ

## What is Context Intelligence?

Context Intelligence (Phase A.77) enables the Aipify Business Operating System (ABOS) to understand organizational situations before assisting. It composes signals from structure, workspaces, users, memory, operations, permissions, strategy, and time — so Aipify can deliver the right assistance to the right people at the right time.

## How is this different from the Context Engine (Phase 35)?

**Phase 35 Context Engine** (`/app/assistant/context`) orchestrates personal calendars and the Universal Calendar Layer (UCL). It helps users schedule and coordinate time.

**Phase A.77 Context Intelligence Engine** (`/app/context-intelligence-engine`) provides **organizational ABOS context intelligence** — tenant structure, workspace scope, historical memory, operational activity, permissions, strategic alignment, and temporal signals. They are complementary, not duplicates.

## What are the eight context dimensions?

1. **Organizational** — tenant membership and org-level defaults  
2. **Workspace** — isolated operational contexts (Organization & Workspace Engine, A.75)  
3. **User** — who is acting, roles, and active workspace selection  
4. **Historical** — organizational memory and decision register (A.34)  
5. **Operational** — open tasks and pending approvals  
6. **Permission** — role permissions and access boundaries  
7. **Strategic** — goals, OKRs, and strategic decisions  
8. **Temporal** — time-bound signals; integrates with Phase 35 for calendar orchestration  

## What are context gaps?

Context gaps are metadata-only summaries (max 500 characters) describing missing or weak context in a dimension — for example, no active workspaces, no organizational memory records, or ambiguous permissions. Gaps have severity (`low` through `critical`) and status (`open`, `acknowledged`, `resolved`, `dismissed`).

## Does Context Intelligence store PII?

No. Gap summaries and signal counts are **metadata only**. No raw email, chat, orders, or PII. Full audit via `cie_*` events.

## Who can view and resolve gaps?

Permissions are enforced server-side:

- `context_intelligence.view` — dashboard, dimensions, gap list  
- `context_intelligence.manage` — settings and proactive level  
- `context_intelligence.gaps.resolve` — acknowledge and resolve gaps  

Owners and administrators have full access by default. Managers can view and resolve gaps. Support agents and viewers can view.

## How does Self Love (A.76) relate?

Self Love monitors context quality — stale dimensions, contradictions, and recurring gap patterns — and will suggest improvements without compromising privacy. Context Intelligence feeds those signals; Self Love does not replace human governance.

## Which engines does Context Intelligence integrate with?

The dashboard links to:

- **Context Engine Phase 35** — `/app/assistant/context` (calendars/UCL)  
- **Organizational Memory** — `/app/organizational-memory-engine`  
- **Organization & Workspace** — `/app/organization-workspace-engine`  
- **Human Oversight** — `/app/human-oversight-engine`  

## Can I export context intelligence data?

Yes. Users with `context_intelligence.view` can export a metadata-only summary via the dashboard or `GET /api/aipify/context-intelligence-engine/export`. Exports are audited as `cie_summary_exported`.

## What proactive levels are available?

Organization settings support `minimal`, `balanced` (default), and `proactive` proactive levels. Gap detection can be enabled or disabled per organization. Business logic lives in Supabase RPCs — UI panels are thin clients.
