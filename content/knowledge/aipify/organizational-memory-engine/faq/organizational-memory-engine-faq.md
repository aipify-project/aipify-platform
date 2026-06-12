# Organizational Memory Engine — FAQ

## What is the Organizational Memory Engine?

The Organizational Memory Engine (Phase A.34) enables Aipify to understand, remember, and continuously learn how an organization operates — without starting from zero every day. Dashboard: `/app/organizational-memory-engine`.

**Mission:** Transform scattered organizational information into structured, usable, and actionable intelligence.

## What should Aipify remember?

- **Operational knowledge** — SOPs, workflows, support routines, escalation paths
- **Organizational preferences** — communication styles, brand guidelines, terminology, priorities
- **Historical context** — past incidents, resolved problems, decisions, lessons learned
- **Customer intelligence** — FAQs, pain points, product knowledge, service expectations
- **Strategic knowledge** — objectives, department goals, KPIs, long-term initiatives

All stored as **metadata summaries** (max 500 characters) — never raw email, chat, or PII.

## What are memory levels?

| Level | Scope |
|-------|--------|
| **Session** | Short-term conversational awareness |
| **Workspace** | Knowledge shared within a specific workspace (A.75) |
| **Organization** | Approved institutional knowledge across the organization |
| **Strategic** | Executive-level insights and decision history |

## What knowledge sources are allowed?

Approved sources include Knowledge Center articles, internal documentation, FAQs, support conversations (metadata), approved meeting notes, policies and procedures, and historical case resolutions. Organizations approve sources and can remove outdated information.

## How is human control enforced?

Organizations can approve knowledge sources, remove outdated information, restrict sensitive content, define retention policies, and review learning summaries. Scheduled memory reviews and archival actions are audit-logged.

## How does Self Love relate to Organizational Memory?

Self Love (planned A.76) will monitor memory quality — detecting duplicates, outdated documentation, contradictions, and recommending cleanup. Self Love protects the health of Organizational Memory.

## How is this different from PAME and the Learning Engine?

**PAME** stores personal assistant memories for individuals. **Learning Engine** improves how Aipify behaves. Organizational Memory stores **tenant-level** operational knowledge with visibility controls. None store raw chat or email content.

## What is the ABOS principle?

Knowledge should not disappear when employees leave. A healthy organization preserves what it learns. Aipify exists to help organizations remember, improve, and grow together — a core **Knowledge** pillar of [ABOS](../../abos/articles/what-is-abos.md).
