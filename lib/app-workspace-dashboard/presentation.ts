import type {
  WorkspaceModuleCard,
  WorkspacePartnerAvailability,
  WorkspaceTicketSummary,
} from "./types";

/** Partner KPI tiles only when Core authorization is truly granted. */
export function shouldShowPartnerSection(
  availability: WorkspacePartnerAvailability
): boolean {
  return availability === "authorized";
}

export function workspaceModulesAreEmpty(modules: WorkspaceModuleCard[]): boolean {
  return modules.length === 0;
}

/** Ticket KPI counts derived from a list payload (not an aggregate RPC). */
export function ticketCountsArePartial(tickets: WorkspaceTicketSummary): boolean {
  return tickets.availability === "available" && tickets.countsPartial === true;
}
