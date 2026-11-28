export type {
  WorkspaceDashboardBundle,
  WorkspaceModuleCard,
  WorkspacePartnerAvailability,
  WorkspacePartnerKpis,
  WorkspacePartnerSummary,
  WorkspaceTicketAvailability,
  WorkspaceTicketCounts,
  WorkspaceTicketPreview,
  WorkspaceTicketSummary,
} from "./types";
export {
  buildWorkspaceTicketSummary,
  detectTicketListCountsPartial,
  mapTicketStatusLabelKey,
} from "./ticket-summary";
export { buildWorkspacePartnerSummary } from "./partner-summary";
export {
  shouldShowPartnerSection,
  ticketCountsArePartial,
  workspaceModulesAreEmpty,
} from "./presentation";
export { loadWorkspaceDashboardBundle } from "./load";
export {
  buildWorkspaceDashboardLabels,
  type WorkspaceDashboardLabels,
} from "./labels";
export { presentWorkspaceLicenseStatusLabel } from "./license-status-label";
