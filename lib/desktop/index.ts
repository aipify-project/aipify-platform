/**
 * Desktop Command Center client foundation (Phase 27).
 * Business logic stays in Aipify Core — desktop consumes APIs only.
 */
export * from "./security";
export * from "./menubar";
export * from "./timeline";
export * from "./morning-briefing";
export * from "./client";
export * from "./session-auth";
export * from "../desktop-companion-foundation/constants";

export const DESKTOP_COMMAND_CENTER_PRINCIPLE =
  "The Desktop Companion is not a separate product. It is another interface connected to Aipify Core.";

export const DESKTOP_TECH_STACK = {
  preferred: "tauri",
  fallback: "electron",
  phase1_os: "macos",
  supported_platforms: ["macos", "windows", "linux"],
} as const;
