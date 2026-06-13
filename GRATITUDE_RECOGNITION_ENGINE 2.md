# Gratitude & Recognition Engine (ABOS)

**Feature owner:** Customer App

Peer appreciation, digital rose gestures, and gratitude moments — boundary-safe warmth that strengthens human connection in everyday work.

## Philosophy

Sincere, human recognition strengthens relationships — help people express appreciation.

## Mission

Cultures where appreciation, gratitude, and recognition are natural in everyday work.

## ABOS principle

Recognition strengthens people — small gestures create lasting memories.

## Vision

Digital rose as symbol someone noticed effort or kindness — technology strengthens human connection.

## Distinctions

- **NOT** Human Success Phase 82 (`/app/human-success`) — adoption/champion recognition for product success
- **NOT** Wonder Engine A.88 (`/app/wonder-engine`) — possibility/amazement reflection
- **NOT** Legacy A.86 (`/app/legacy-engine`) — organizational story preservation
- **NOT** Humor & Personal Connection (`/app/personality`) — humor/warmth modes
- **NOT** Relationship Intelligence A.78/RSI — relationship reminders (no impersonation)
- **Gratitude & Recognition** — peer appreciation, digital rose gestures, gratitude moments, boundary-safe warmth

## Route

`/app/gratitude-recognition-engine` — nav id `gratitudeRecognitionEngine`

## Module

`gratitude_recognition_engine`

## Tables

- `organization_gratitude_recognition_settings` — enabled, digital_rose_enabled, gratitude_moments_enabled, redirect_romantic_language, metadata
- `organization_gratitude_moments` — moment_type, summary, recognition_target_role, status, metadata
- `organization_digital_rose_recognitions` — sender_user_id, recipient_display_label, message_summary, rose_sent_at, metadata

## Permissions

`gratitude_recognition.view` · `gratitude_recognition.manage` · `gratitude_recognition.rose.send` · `gratitude_recognition.export`

## RPCs

`get_gratitude_recognition_engine_card` · `get_gratitude_recognition_engine_dashboard` · `update_gratitude_recognition_settings` · `send_digital_rose_recognition` · `export_gratitude_recognition_report`

## Red Rose Moment

When a user says "I love you Aipify" — warm trust response redirecting to recognize others; optional Digital Recognition Rose to a colleague. Never romantic — avoid "I love you too".

Metadata only — no raw messages, emails, or PII beyond approved summaries.
