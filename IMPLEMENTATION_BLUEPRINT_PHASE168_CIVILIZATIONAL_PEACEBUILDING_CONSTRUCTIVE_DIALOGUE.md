# Implementation Blueprint — Phase 168

## Civilizational Peacebuilding & Constructive Dialogue Engine

**Feature owner:** Customer App  
**Route:** `/app/constructive-dialogue-engine`  
**Nav id:** `constructiveDialogueEngine`  
**Module key:** `constructive_dialogue_engine`  
**Migration:** `20261328000000_civilizational_peacebuilding_constructive_dialogue_engine_phase168.sql`

## Era context

Post-Enterprise & Civilizational Era (161–170). Phases 161–167 provide authoritative RPCs for their domains — Phase 168 **cross-links only**, never duplicates.

## Mission

Unify constructive dialogue visibility — Constructive Dialogue Center where organizations navigate disagreement with curiosity, respect, and peacebuilding without forced agreement or suppression of dissent.

## Blueprint helpers (`_cpdebp168_*`)

| Helper | Purpose |
|--------|---------|
| `_cpdebp168_distinction_note()` | NOT forced agreement; vs Phase 137 council |
| `_cpdebp168_mission()` | Mission statement |
| `_cpdebp168_philosophy()` | People First philosophy |
| `_cpdebp168_abos_principle()` | ABOS framing |
| `_cpdebp168_vision()` | Vision statement |
| `_cpdebp168_objectives()` | Eight blueprint objectives |
| `_cpdebp168_constructive_dialogue_center()` | Eight center capabilities |
| `_cpdebp168_peacebuilding_engine()` | Six peacebuilding principles |
| `_cpdebp168_conflict_navigation_framework()` | Five navigation dimensions |
| `_cpdebp168_executive_dialogue_reviews()` | Five executive review questions |
| `_cpdebp168_dialogue_companion()` | Companion capabilities + must_not |
| `_cpdebp168_perspective_expansion_engine()` | Perspective sources |
| `_cpdebp168_relationship_resilience_engine()` | Resilience initiatives |
| `_cpdebp168_dialogue_memory_engine()` | Memory types |
| `_cpdebp168_companion_limitations()` | must_avoid list |
| `_cpdebp168_self_love_connection()` | Self Love A.76 cross-link |
| `_cpdebp168_security_requirements()` | Audit, RBAC, 2FA |
| `_cpdebp168_integration_links()` | Era + related phase routes |
| `_cpdebp168_engagement_summary(uuid)` | Live engagement metrics |
| `_cpdebp168_success_criteria(uuid)` | Blueprint success criteria |
| `_cpdebp168_blueprint_block(uuid)` | Full blueprint JSON block |

## Tables (metadata-only, tenant-scoped + RLS)

- `constructive_dialogue_settings`
- `constructive_dialogue_reviews`
- `constructive_dialogue_programs`
- `constructive_dialogue_memory`
- `constructive_dialogue_audit_logs`

## RPCs

- `get_constructive_dialogue_engine_dashboard(p_org_id uuid)`
- `get_constructive_dialogue_engine_card(p_org_id uuid)`
- `record_executive_dialogue_review(...)`
- `record_dialogue_memory_entry(...)`

## Permissions

- `constructive_dialogue.view`
- `constructive_dialogue.manage`
- `constructive_dialogue.contribute`

## i18n

`customerApp.constructiveDialogueEngine.phase168.*` in en/no/sv/da.

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase168-civilizational-peacebuilding-constructive-dialogue.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase168-vocabulary.ts`

## Critical constraints

1. **NOT forced agreement** — curiosity and respect over consensus pressure.
2. **NOT suppression of dissent** — diverse perspectives welcome.
3. **NOT employee surveillance** — no dialogue scoring of individuals.
4. **Dialogue Companion** — understanding support only; does not determine who is right.
5. **Cross-link Phase 137** — never duplicate `_cdcc_*` RPCs.
