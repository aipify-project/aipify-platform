# Wisdom Engine (ABOS)

**Feature owner:** Customer App

Transform knowledge and experience into thoughtful guidance — wisdom determines what matters most.

## Philosophy

Wisdom is context, trade-offs, and humility — not just answers. Apply knowledge responsibly; determine which questions matter most.

## Mission

Better decisions through learning from experience, balancing priorities, and weighing long-term consequences.

## ABOS principle

Intelligence answers questions; wisdom determines which questions matter.

## Vision

Decisions you can be proud of years later — thoughtful, responsible, centered on people and purpose; move forward with care.

## Distinctions

- **NOT** Assistant DSE Phase 38 (`/app/assistant/decisions`) — personal/business decision recommendations RPC
- **NOT** Organizational Decision Support A.54 — structured org decisions with approval workflows
- **NOT** Strategic Intelligence A.31 — opportunity/risk detection
- **NOT** Curiosity & Discovery A.87 — exploration prompts
- **NOT** Legacy A.86 — story preservation
- **NOT** Organizational Memory A.34 — capture/register (integrates as source)
- **Wisdom Engine** — experience-to-guidance synthesis, trade-off framing, humility, long-term thinking

## Cross-links

- **Organizational Memory A.34:** registered lessons and approved org memory as wisdom sources
- **Organizational Decision Support A.54:** structured org decisions — wisdom frames, ODSE executes workflow
- **Assistant DSE Phase 38:** personal/business recommendations — wisdom prepares trade-offs, DSE recommends
- **Growth & Evolution A.81:** experience → insight via continuous learning
- **Impact Engine A.85:** impact observations as wisdom sources

## Route

`/app/wisdom-engine` — nav id `wisdomEngine`

## Module

`wisdom_engine`

## Tables

- `organization_wisdom_engine_settings` — enabled, humility_mode_enabled, trade_off_prompts_enabled, pause_before_major_decisions, metadata
- `organization_wisdom_insights` — source_type, summary, trade_offs jsonb, humility_note, metadata — NO raw content
- `organization_wisdom_guidance_prompts` — prompt, context_summary, considerations jsonb, status (pending/reviewed/dismissed)

## Permissions

`wisdom_engine.view` · `wisdom_engine.manage` · `wisdom_engine.export` · `wisdom_engine.guidance.review`

## RPCs

`get_wisdom_engine_card` · `get_wisdom_engine_dashboard` · `update_wisdom_engine_settings` · `review_wisdom_guidance_prompt` · `export_wisdom_engine_report`

## Thoughtful guidance

Similar past approach · pros/cons framing · efficiency vs trust · valid stakeholder perspectives · long-term pride test.

## Humility

"There are factors I cannot evaluate" · "Human judgment is important" · "Additional expertise may be valuable"

Metadata only — insight summaries (max 500 chars), trade-off framing, guidance prompt status — never raw conversations, emails, or PII.
