# Wisdom Engine — FAQ

## What is the Wisdom Engine?

The Wisdom Engine (Phase A.93) transforms knowledge and experience into thoughtful guidance. Wisdom is context, trade-offs, and humility — not just answers. It helps organizations apply knowledge responsibly and focus on what matters most.

## How is this different from Assistant Decision Support (DSE Phase 38)?

**Assistant DSE** (`/app/assistant/decisions`) provides personal and business decision recommendations via RPC. **Wisdom Engine** synthesizes experience into trade-off framing and humility-aware guidance — it prepares thoughtful context; humans still decide.

## How is this different from Organizational Decision Support (A.54)?

**Organizational Decision Support A.54** manages structured org decisions with approval workflows. **Wisdom Engine** frames trade-offs and long-term consequences from experience — it integrates as guidance input, not a replacement for ODSE workflows.

## How is this different from Strategic Intelligence (A.31)?

**Strategic Intelligence A.31** detects opportunities and risks. **Wisdom Engine** determines which questions matter and how past experience should inform responsible choices — synthesis, not signal detection.

## How is this different from Curiosity & Discovery (A.87)?

**Curiosity & Discovery A.87** inspires exploration and innovation prompts. **Wisdom Engine** applies lessons learned to decision framing — experience-to-guidance, not exploration.

## How is this different from Legacy Engine (A.86)?

**Legacy A.86** preserves organizational stories and milestones. **Wisdom Engine** converts experience into actionable guidance with trade-offs and humility — not story preservation.

## How is this different from Organizational Memory (A.34)?

**Organizational Memory A.34** captures and registers approved org memory. **Wisdom Engine** consumes org memory as a source and synthesizes insights — capture vs guidance synthesis.

## What are wisdom sources?

Historical experiences, org memory, lessons learned, relationship patterns, impact observations, Knowledge Center articles, reflection after setbacks, and long-term outcomes — all metadata-only summaries.

## What are wisdom principles?

What was learned before, trade-offs, what matters most, consequences, short vs long term, humility, and human judgment — people decide; Aipify prepares and frames.

## What are thoughtful guidance examples?

Similar past approach framing, pros/cons (e.g. efficiency vs trust), valid stakeholder perspectives, and the long-term pride test — decisions you can stand behind years later.

## What is humility mode?

When enabled, guidance includes honest limitations: factors Aipify cannot evaluate, the importance of human judgment, and when additional expertise may be valuable.

## Who can review guidance prompts?

`wisdom_engine.guidance.review` is required to mark prompts as reviewed or dismissed. Owners, administrators, managers, and employees have this by default (employees: review only, not manage).

## What data is stored?

Metadata only — insight summaries (max 500 chars), trade-off JSON, humility notes, guidance prompt text, and status counts. No raw chat, emails, or PII.

## What integrations does Wisdom Engine use?

Organizational Memory A.34, Organizational Decision Support A.54, Assistant DSE, Impact Engine A.85, Growth & Evolution A.81, and Purpose & Values A.82. See integration links on the dashboard.
