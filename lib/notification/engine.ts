/** Phase 26 — Notification Engine (consumes Aipify Core events; no duplicated business logic). */

export const NOTIFICATION_ENGINE_PRINCIPLE =
  "There is only ONE Aipify. Web, Desktop and Mobile are interfaces to the same intelligence layer.";

export const NOTIFICATION_ENGINE_RESPONSIBILITIES = [
  "Collect important events from Aipify Core",
  "Prioritise notifications by level",
  "Respect user preferences and quiet hours",
  "Distribute to web, desktop, email, and future mobile channels",
  "Track engagement to prevent alert fatigue",
] as const;

export const AIPIFY_CORE_STACK = [
  "install_engine",
  "skillos",
  "intelligence_engine",
  "action_engine",
  "presence_engine",
  "update_engine",
  "trust_engine",
  "license_engine",
  "executive_engine",
  "notification_engine",
] as const;

export const CONNECTED_CLIENTS = ["web", "desktop", "mobile"] as const;

export type ConnectedClient = (typeof CONNECTED_CLIENTS)[number];
