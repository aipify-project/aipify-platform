import type { ExecutionCoordinationCenter, ExecutionDashboardWidget } from "./types";

export function buildExecutionDashboardWidgets(
  center: ExecutionCoordinationCenter | null
): ExecutionDashboardWidget[] {
  if (!center?.found) return [];
  return [
    { id: "startingToday", titleKey: "startingToday", items: center.starting_today ?? [] },
    { id: "inProgress", titleKey: "inProgress", items: center.in_progress ?? [] },
    { id: "blocked", titleKey: "blocked", items: center.blocked ?? [] },
    { id: "awaitingDependencies", titleKey: "awaitingDependencies", items: center.awaiting_dependencies ?? [] },
    { id: "upcomingDeadlines", titleKey: "upcomingDeadlines", items: center.upcoming_deadlines ?? [] },
    { id: "completed", titleKey: "completed", items: center.completed ?? [] },
    { id: "executivePriority", titleKey: "executivePriority", items: center.executive_priority ?? [] },
  ];
}
