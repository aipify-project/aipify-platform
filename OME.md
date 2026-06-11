# Organizational Memory Engine (OME) — Phase 50

Institutional memory — preserve context, reasoning and lessons learned.

**Spec:** `aipify-core/modules/organizational-memory-engine/phase-50-organizational-memory-engine.txt`  
**Code:** `lib/aipify/organizational-memory/`  
**Timeline:** `/app/memory`  
**API:** `/api/aipify/memory/*`

---

## Principle

> Experience creates wisdom. Wisdom deserves to be preserved. Aipify helps organizations remember.

Not a document archive. An organizational memory system.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter | Personal memory notes, manual knowledge entries |
| Business Pro | + Organizational timeline, decision logging, lessons learned, search, since-last-login summaries |
| Enterprise | + Department/executive visibility, strategic continuity |

Module gate: `organizational_memory` in `lib/core/plans.ts` (all tiers).

---

## Memory categories

`strategic_decision` · `project` · `operational` · `customer` · `improvement`

## Visibility

`personal` · `tenant` · `department` · `executive`

---

## Database

- `aipify_memory_entries` — knowledge captures with tags and visibility
- `aipify_decision_records` — decision title, rationale, alternatives, outcomes
- `aipify_lessons_learned` — what worked, what didn't, future recommendations

**RPCs:** `get_customer_organizational_memory_center()`, `get_organizational_memory_timeline()`, `search_organizational_memory()`, `create_memory_entry()`, `update_memory_entry()`, `delete_memory_entry()`, `create_decision_record()`, `create_lesson_learned()`

Migration: `supabase/migrations/20260613800000_organizational_memory_engine_phase50.sql`

---

## Integrations

- **Business Pulse** — historical pulse summaries in memory context
- **Strategic Goals** — completed goals preserved in timeline context
- **Friction Intelligence** — implemented improvements linked to memory
- **Action Center** — important actions can link to memory records (planned)

---

## Ethics

Role-based visibility. No employee surveillance. Audit-friendly. Transparent access rules.
