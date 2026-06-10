import { DESKTOP_CLIENT_PLATFORMS } from "./notifications";

/** Future desktop app sidebar sections (Phase 25 foundation). */

export const DESKTOP_SIDEBAR_SECTIONS = [
  "health_status",
  "recent_activity",
  "recommendations",
  "executive_summary",
  "pending_approvals",
  "active_skills",
] as const;

export type DesktopSidebarSection = (typeof DESKTOP_SIDEBAR_SECTIONS)[number];

export type DesktopPresenceSidebar = {
  health_status: { score: number; label: string };
  recent_activity: Array<{ id: string; title: string; created_at: string }>;
  recommendations: Array<{ id: string; message: string }>;
  executive_summary: string;
  pending_approvals: number;
  active_skills: number;
};

export type DesktopPresenceBundle = {
  principle: string;
  sidebar: DesktopPresenceSidebar;
  unread_count: number;
  desktop_clients_prepared: typeof DESKTOP_CLIENT_PLATFORMS;
};
