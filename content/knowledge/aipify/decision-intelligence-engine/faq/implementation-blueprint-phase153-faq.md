# Institutional Wisdom & Decision Heritage Engine — FAQ

## What is the Decision Heritage Center?

The Decision Heritage Center at `/app/decision-intelligence-engine` is **Phase 153** of the Legacy & Future Stewardship Era (151–160). It extends Decision Intelligence Phase 125 with institutional decision wisdom — strategic archives, outcome reviews, executive reflections, and aggregate pattern themes.

## Does Phase 153 replace Decision Intelligence Phase 125?

**No.** Phase 153 layers on Phase 125 at the same route. All `_dein_*` and `_deibp125_*` dashboard fields are preserved. Phase 153 adds `_iwdhbp153_*` heritage depth.

## Is this a duplicate Wisdom Engine?

**No.** Wisdom Engine A.93 at `/app/wisdom-engine` remains the experience-to-guidance surface. Phase 153 cross-links only — never duplicates `_wis_*` RPCs.

## What does the Wisdom Companion do?

The Wisdom Companion supports decision summaries, historical context retrieval, reflection prompts, outcome comparisons, knowledge discovery, and leadership preparation. It **does not** rewrite history, suppress alternative interpretations, determine future decisions, replace executive accountability, or improperly reveal confidential decision histories.

## What are pattern snapshots?

Pattern snapshots are **aggregate theme metadata** — repeated success patterns, risk themes, governance strengths, and similar institutional themes. They support learning **NOT** judgment or individual scoring.

## Which surfaces does Phase 153 cross-link?

| Surface | Route |
|---------|-------|
| Future Leaders Phase 151 | `/app/future-leaders-engine` |
| Organizational Legacy Phase 152 | `/app/organizational-memory-engine` |
| Decision Intelligence Phase 125 | `/app/decision-intelligence-engine` |
| Wisdom Engine A.93 | `/app/wisdom-engine` |
| Collective Decision Phase 137 | `/app/collective-decision-council-engine` |
| ODSE A.54 | `/app/organizational-decision-support-engine` |
| Organizational Memory A.34 | `/app/organizational-memory-engine` |
| Personal DSE | `/app/assistant/decisions` |
| Self Love A.76 | `/app/self-love-engine` |

## What thin RPCs are available?

| RPC | Purpose |
|-----|---------|
| `archive_decision_heritage_entry(...)` | Create strategic decision archive metadata |
| `record_decision_outcome_review(...)` | Record periodic outcome review metadata |
| `record_executive_decision_reflection(...)` | Record leadership reflection metadata |

## What data is stored?

**Metadata only** — decision summaries, context summaries, alternatives, outcome review prompts, executive reflection summaries, and aggregate pattern themes (max ~500 chars where applicable). No raw meeting transcripts, email content, chat, or PII.

## What are the security requirements?

Decision archive audit logs · executive access controls · RBAC (`decision_intelligence.view` / `decision_intelligence.manage`) · historical access tracking · 2FA for executive heritage access.

## Does Aipify decide for leaders based on heritage?

**No.** Heritage preserves understanding for future learning. Humans retain executive accountability. Patterns inform — they do not judge individuals or determine outcomes.
