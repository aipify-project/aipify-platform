# Gratitude & Recognition Engine — Phase A.89

**Feature owner:** Customer App

ABOS engine for peer appreciation, digital rose gestures, and gratitude moments — boundary-safe warmth.

## Distinctions

- **NOT** Human Success Phase 82 (`/app/human-success`)
- **NOT** Wonder Engine A.88 (`/app/wonder-engine`)
- **NOT** Legacy A.86 (`/app/legacy-engine`)
- **NOT** Humor & Personal Connection (`/app/personality`)
- **NOT** Relationship Intelligence A.78/RSI
- **A.89 Gratitude & Recognition** — peer appreciation, digital roses, gratitude moments, Red Rose Moment boundaries

## Route

`/app/gratitude-recognition-engine` — nav id `gratitudeRecognitionEngine`

## Module

`gratitude_recognition_engine`

## Migration

`supabase/migrations/20260938000000_gratitude_recognition_engine_phase_a89.sql` — prefix `_gre_`

## Tables

- `organization_gratitude_recognition_settings`
- `organization_gratitude_moments`
- `organization_digital_rose_recognitions`

## Permissions

`gratitude_recognition.view` · `gratitude_recognition.manage` · `gratitude_recognition.rose.send` · `gratitude_recognition.export`

## RPCs

`get_gratitude_recognition_engine_card` · `get_gratitude_recognition_engine_dashboard` · `update_gratitude_recognition_settings` · `send_digital_rose_recognition(p_recipient_label, p_message_summary)` · `export_gratitude_recognition_report`

Dashboard includes: philosophy, mission, abos_principle, vision, gratitude_moment_types, red_rose_moment, boundary_phrases, self_love_note, integration_links, settings, recent_moments, recent_roses (count only), summary.

## Code paths

- `lib/core/gratitude-recognition.ts`
- `lib/aipify/gratitude-recognition-engine/`
- `app/api/aipify/gratitude-recognition-engine/`
- `app/app/gratitude-recognition-engine/page.tsx`
- `components/app/gratitude-recognition-engine/`
- `lib/internal-language-model/gratitude-recognition-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/gratitude-recognition-engine-abos.txt`
- `content/knowledge/aipify/gratitude-recognition-engine/faq/gratitude-recognition-engine-faq.md`

## decision_explanations

Append `gratitude_recognition_engine` to `decision_explanations_decision_type_check` (includes legacy_engine, curiosity_discovery_engine, wonder_engine from A.86–A.88 chain).
