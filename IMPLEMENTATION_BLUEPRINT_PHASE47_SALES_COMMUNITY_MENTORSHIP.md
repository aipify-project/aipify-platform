# Implementation Blueprint — Phase 47: Sales Community & Mentorship Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Community**

> **Mapping:** Blueprint Phase 47 extends **Sales Expert OS A.95** — not a separate engine route. Cross-links Coach & Enablement Phase 45/46, Performance & Recognition Phase 41, Gratitude & Recognition A.89, Academy Phase 94, Partner Success A.73, and Self Love A.76.

## Distinction from org-wide Community (Phase 89)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Org Community Phase 89** | `/app/community` | Tenant org-wide knowledge sharing and collective intelligence |
| **Sales Expert Community Phase 47** | `/app/sales-expert-engine` (Community tab) | Peer community and voluntary mentorship among Sales Experts |

Documented in `_scmbp_distinction_note()`.

## Mission

Build a supportive Sales Expert community where partners learn from each other, share honest success stories, and grow through voluntary mentorship — never alone in the journey.

## Core philosophy

**Peer learning strengthens everyone. Mentorship is voluntary and respectful. Recognition educates — it does not boast.**

Aipify Business Operating System (ABOS) grows when Sales Experts support each other — humans decide, Aipify informs and connects.

## Objectives

1. **Peer learning** — practical lessons from partner experiences (metadata only)
2. **Voluntary mentorship** — experienced experts guide newer partners
3. **Best practices library** — honest playbooks and outreach ideas
4. **Community recognition** — Mentor, Community Contributor, Knowledge Champion
5. **Collaborative problem-solving** — Q&A and constructive discussions
6. **Belonging** — encouragement and perspective through setbacks

## Mentorship program

- **Voluntary** — experienced → newer mentor links
- **Guidance areas:** demo preparation, follow-up rhythm, confidence building, implementation scope
- Either party may decline or pause — no penalty
- Complements Coach tab Phase 45/46 recommendations

## Community hub

Channels with example prompts (🌹🦉🔔):

- Discussions
- Success stories
- Q&A
- Inspiration
- Best practice library

Trust rules: respect, professionalism, constructive dialogue — no harassment, shaming, or misleading advice.

## Success story library

Categories: first customer, outreach ideas, challenges overcome, implementation wins, renewals, best practices, mentorship.

- Summaries **max 500 characters**
- Author display metadata only — **no customer PII**
- Educate peers — not boast

Tables: `sales_expert_success_stories` (tenant-scoped scaffold).

## Community recognition

| Badge | Emoji | Meaning |
|-------|-------|---------|
| Mentor | 🌹 | Voluntarily guides newer experts |
| Community Contributor | 🔔 | Shares helpful discussions |
| Knowledge Champion | 🦉 | Curates best practices |

Cross-links Phase 41 encouragement leaderboards — **collaboration over aggressive competition**.

## Self Love connection

You are not alone in the Sales Expert journey — community offers encouragement, perspective, and support through setbacks. Cross-link Self Love A.76.

## Sales Coach connection

Coach tab recommends relevant discussions, mentors, and community resources — never replaces human judgment.

## Regional groups (scaffold)

Nordic (no/sv/da/en), Europe, Global — i18n in en/no/sv/da.

## Dogfooding

Aipify Group Sales Experts participate in the community first — validate mentorship tone, story categories, and recognition badges.

## Success criteria

Live via `_scmbp_blueprint_success_criteria()` — objectives, voluntary mentorship, hub channels, story library, recognition badges, coach connection, regional groups, Self Love, trust rules, dogfooding.

## Technical deliverables

| Asset | Path |
|-------|------|
| Migration | `supabase/migrations/20260997000000_implementation_blueprint_phase47_sales_community_mentorship.sql` |
| Types / parse | `lib/aipify/sales-expert-operating-system/` |
| UI tab | `components/app/sales-expert-engine/SalesCommunityTab.tsx` |
| i18n | `locales/{en,no,sv,da}/customerApp.json` |
| ILM | `lib/internal-language-model/implementation-blueprint-phase47-vocabulary.ts` |
| FAQ | `content/knowledge/aipify/sales-expert-engine/faq/implementation-blueprint-phase47-faq.md` |

## Vision

- Sales Experts grow faster together — when learning is honest and encouragement is genuine.
- Mentorship is a gift freely given — never an obligation or status weapon.
- Community recognition educates peers and celebrates contribution — not ego.
