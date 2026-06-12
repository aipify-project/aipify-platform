# Organizational Memory & Legacy Engine — Phase 126

## Enterprise Intelligence Era (121–130)

Phase 126 deepens **Organizational Memory Engine A.34** at `/app/organizational-memory-engine` with Enterprise Intelligence scaffolding — memory archives, succession intelligence, storytelling framework, critical knowledge protection, heritage library, and Legacy Companion.

## Vision

Organizations forget — preserve decisions, experiences, principles, and stories. Wisdom before speed. People First. Memory as asset, not accident.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261216000000_implementation_blueprint_phase126_organizational_memory_legacy.sql` |
| Lib | `lib/aipify/organizational-memory-engine/` |
| API | `/api/aipify/organizational-memory-engine/dashboard`, `/api/aipify/organizational-memory-engine/card` |
| UI | `/app/organizational-memory-engine` (existing — no new route) |
| RPC prefix | `_omlebp126_*` (blueprint — never collide with `_omlebp94_*`, `_mcebp_*`) |
| KC FAQ | `content/knowledge/aipify/organizational-memory-engine/faq/implementation-blueprint-phase126-faq.md` |
| Blueprint | `IMPLEMENTATION_BLUEPRINT_PHASE126_ORGANIZATIONAL_MEMORY_LEGACY.md` |

## Prior blueprint layers (preserved)

| Layer | Migration | Helpers |
|-------|-----------|---------|
| A.34 baseline | `20260805000000_organizational_memory_engine_phase_a34.sql` | `_ome_*` |
| Phase 55 Memory Continuity | `20261005000000_implementation_blueprint_phase55_memory_continuity.sql` | `_mcebp_*` |
| Phase 94 Memory & Legacy | `20261117000000_implementation_blueprint_phase94_organizational_memory_legacy.sql` | `_omlebp94_*` |

## Phase collision

Blueprint Phase 94 and Enterprise Intelligence Phase 126 share the "Organizational Memory & Legacy" theme. Phase 126 **layers on** Phase 94 — documented in `_omlebp126_distinction_note()`. All Phase 94 dashboard and card fields preserved.

## Organizational Memory Center (9 capabilities)

Memory archives · legacy records · knowledge preservation · transformation histories · leadership continuity · decision histories · milestone tracking · succession support · institutional storytelling

## Cross-links

| Engine | Route |
|--------|-------|
| Decision Intelligence Phase 125 | `/app/decision-intelligence-engine` |
| Executive Intelligence Phase 121 | `/app/executive-intelligence` |
| Digital Twin Phase 124 | `/app/digital-twin` |
| Legacy Engine A.86 | `/app/legacy-engine` |
| Employee Knowledge | `/app/settings/employee-knowledge` |
| Knowledge Center A.5 | `/app/knowledge-center-engine` |
| Self Love A.76 | `/app/self-love-engine` |
| Aipify University Phase 115 | `/app/aipify-university` |
| Continuity Blueprint 73 | `/app/continuity` |

## Rules

- Metadata/governed retention only — no surveillance, no raw PII
- Humans custodians of legacy — no altering historical records via Companion
- Do NOT duplicate Legacy Engine A.86 `_leg_*` RPCs or tables
- Thin clients; RPC business logic
- Permissions: `memory.view` (existing)

## Success metrics

Wisdom preservation · knowledge continuity · succession readiness · onboarding acceleration · reduced repeated mistakes · institutional identity strength · heritage library engagement · governed retention health
