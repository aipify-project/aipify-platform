# Wisdom Intervention Protocol — FAQ

## What is the Wisdom Intervention Protocol?

The Wisdom Intervention Protocol (Phase A.94) gently encourages reflection before emotionally charged communications — angry emails, excessive caps, aggressive wording, late-night sends, and high-risk messages. It offers perspective, not control; you always decide.

## How is this different from the Wisdom Engine (A.93)?

**Wisdom Engine A.93** synthesizes experience into broader guidance over time — trade-offs, humility, long-term thinking. **Wisdom Intervention A.94** is a pre-send pause for a single communication moment — impulse to action, not accumulated wisdom patterns.

## How is this different from Human Oversight (A.40)?

**Human Oversight A.40** governs AI action approval tiers and critical confirmations. **Wisdom Intervention** never blocks sends — it may suggest reflection, save draft, or sleep on it.

## How is this different from Trust & Action Engine?

**Trust & Action Engine** enforces sensitive action policies and approval workflows. **Wisdom Intervention** does not execute or gate actions — gentle nudges only.

## How is this different from Inclusion & Humanity (A.83)?

**Inclusion & Humanity A.83** handles organizational de-escalation and respectful conduct in conversation. **Wisdom Intervention** focuses on pre-send emotional charge detection and personal reflection before outbound communication.

## How is this different from Attention Guardian (TAG)?

**Attention Guardian** protects focus mode and attention allocation. **Wisdom Intervention** addresses communication timing and tone — not focus sessions or productivity blocking.

## What is the Pause & Reflection integration?

Pause & Reflection Protocol is implemented through the same Wisdom Intervention dashboard at `/app/wisdom-intervention-protocol` — one surface, shared boundaries, no duplicate engine.

## What is the sleep-on-it principle?

Important communications drafted late or under strong emotion may receive a gentle nudge to revisit tomorrow. Templates support an optional `{name}` placeholder from settings — never hardcoded pilot names in default customer copy.

## What can Aipify do and not do?

**May:** recommend reflection, suggest saving a draft, offer gentle perspective, record metadata-only signal summaries and outcomes.

**May not:** prevent sending, override autonomy, store raw message content, force mandatory delays, or imply Aipify controls outcomes.

## Who can manage settings and record outcomes?

`wisdom_intervention.manage` is required for settings updates and `record_wisdom_intervention_outcome`. Owners, administrators, and managers have this by default.

## What data is stored?

Metadata only — signal summaries (max 500 chars), suggested intervention labels, prompt templates, and user-chosen outcomes (`proceeded`, `revised`, `postponed`, `dismissed`). No raw email, chat, or message bodies.

## What integrations does Wisdom Intervention link to?

Human Oversight, Approvals (Trust & Action), Inclusion & Humanity, Attention Guardian, Presence & Comfort A.90, and Purpose & Values — see integration links on the dashboard.
