import type { StrategicInitiativePortfolio, PortfolioDashboardWidget } from "./types";

export function buildPortfolioDashboardWidgets(
  portfolio: StrategicInitiativePortfolio | null
): PortfolioDashboardWidget[] {
  if (!portfolio?.found) return [];
  return [
    { id: "active", titleKey: "active", items: portfolio.active ?? [] },
    { id: "awaitingApproval", titleKey: "awaitingApproval", items: portfolio.awaiting_approval ?? [] },
    { id: "inExecution", titleKey: "inExecution", items: portfolio.in_execution ?? [] },
    { id: "blocked", titleKey: "blocked", items: portfolio.blocked ?? [] },
    { id: "completed", titleKey: "completed", items: portfolio.completed ?? [] },
    { id: "cancelled", titleKey: "cancelled", items: portfolio.cancelled ?? [] },
    { id: "executivePriority", titleKey: "executivePriority", items: portfolio.executive_priority_list ?? [] },
  ];
}
