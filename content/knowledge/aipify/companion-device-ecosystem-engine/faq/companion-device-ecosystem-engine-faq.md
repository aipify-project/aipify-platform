# Companion Device Ecosystem Engine — FAQ

## What is the Companion Device Ecosystem Engine?

Phase A.96 orchestration hub for cross-device companion experience. It coordinates roadmap metadata and integration links — it does **not** replace device-specific engines.

## How is this different from Desktop Companion or Command Center?

- **Desktop Companion** (Blueprint 20) — web companion at `/app/desktop`
- **Desktop Command Center** (Phase 27) — native Tauri client at `/app/command-center`
- **Companion Device Ecosystem Engine** — orchestration and cross-links only

## How is this different from Mobile Companion?

Mobile Companion (Blueprint 21) extends the Notification & Communication Engine (A.17) at `/app/notification-communication-engine`. Native mobile apps are a future phase.

## Where do connected device counts come from?

From **Companion Presence** (A.67) via the existing `companion_presence` table — heartbeat storage is not duplicated.

## Does Aipify monitor keystrokes or screens?

No. Metadata only — no keystroke logging, screen monitoring, or ambient surveillance.

## What about voice and wearables?

Future scaffolds with honest status. Voice and wearable experiences are documented but not fully shipped.

## Related surfaces

See integration links on the dashboard: Self Love (A.76), Proactive Companion (A.79), Companion Identity (A.84), Personal Productivity (A.70), Enterprise Device Rollout (A.39).
