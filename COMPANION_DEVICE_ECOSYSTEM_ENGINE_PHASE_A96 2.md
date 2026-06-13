# Companion Device Ecosystem Engine — Phase A.96

People move between devices throughout the day. Aipify should follow naturally without disruption.

## Mission

Unified companion experience across desktop, mobile, tablet, and future device categories.

## Philosophy

Device-specific engines own their surfaces. The Companion Device Ecosystem Engine orchestrates cross-device readiness, continuity preferences, and honest roadmap status — metadata only.

## Distinctions

- **NOT** Desktop Companion (Blueprint 20 / Phase 61) — owns `/app/desktop`
- **NOT** Mobile Companion (Blueprint 21) — extends A.17 at `/app/notification-communication-engine`
- **NOT** Desktop Command Center (Phase 27) — native Tauri client at `/app/command-center`
- **NOT** Companion Presence (A.67) — floating orb and device heartbeat at `/app/settings/companion-presence`
- **A.96 Companion Device Ecosystem Engine** — orchestration hub with cross-links and roadmap metadata

## Route

`/app/companion-device-ecosystem-engine` — nav id `companionDeviceEcosystemEngine`

## Module

`companion_device_ecosystem_engine`

## Migration

`supabase/migrations/20260987000000_companion_device_ecosystem_engine_phase_a96.sql` — tenant helpers `_cdee_*` ( `_cde_*` reserved for Curiosity Discovery A.87), blueprint helpers `_cdebp_*`

## Tables

- `companion_device_ecosystem_settings` — org preferences (continuity, wearable, voice scaffold)
- Connected device counts read from existing `companion_presence` — no duplicated heartbeat storage

## Permissions

`companion_device_ecosystem.view` · `companion_device_ecosystem.manage`

## RPCs

`get_companion_device_ecosystem_card` · `get_companion_device_ecosystem_dashboard` · `update_companion_device_ecosystem_settings`

## Code paths

- `lib/core/companion-device-ecosystem.ts`
- `lib/aipify/companion-device-ecosystem/`
- `app/api/aipify/companion-device-ecosystem-engine/`
- `app/app/companion-device-ecosystem-engine/page.tsx`
- `components/app/companion-device-ecosystem-engine/`
- `lib/internal-language-model/implementation-blueprint-phase36-vocabulary.ts`
- `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase36-companion-device-ecosystem.txt`

## decision_explanations

Append `companion_device_ecosystem_engine` to `decision_explanations_decision_type_check` (full list from A.95 + security_trust_engine + api_platform_engine + companion_device_ecosystem_engine).
