import type {
  AppSoftwareModuleKey,
  ModuleEntitlementState,
} from "@/lib/app-module-manifest";
import type { SupportRequestStatus } from "@/lib/app-portal/support-requests";

export type WorkspaceTicketAvailability =
  | "available"
  | "unavailable"
  | "forbidden"
  | "error";

export type WorkspaceTicketCounts = {
  open: number | null;
  waitingAipify: number | null;
  waitingCustomer: number | null;
  resolved: number | null;
};

export type WorkspaceTicketPreview = {
  id: string;
  reference: string;
  title: string;
  status: SupportRequestStatus | "unknown";
  updatedAt: string | null;
  href: string;
};

export type WorkspaceTicketSummary = {
  availability: WorkspaceTicketAvailability;
  counts: WorkspaceTicketCounts;
  recent: WorkspaceTicketPreview[];
  lastUpdatedAt: string | null;
  listHref: string;
  createHref: string | null;
  createEnabled: boolean;
  messageKey?: "unavailable" | "forbidden" | "error";
};

export type WorkspacePartnerAvailability =
  | "authorized"
  | "not_authorized"
  | "unavailable"
  | "error";

export type WorkspacePartnerKpis = {
  registeredSales: number | null;
  pendingCommission: number | null;
  earnedCommission: number | null;
  payableCommission: number | null;
  currency: string | null;
};

export type WorkspacePartnerSummary = {
  availability: WorkspacePartnerAvailability;
  kpis: WorkspacePartnerKpis;
  partnerHref: string | null;
  lastUpdatedAt: string | null;
  messageKey?: "not_authorized" | "unavailable" | "error";
};

export type WorkspaceModuleCard = {
  moduleKey: AppSoftwareModuleKey;
  state: ModuleEntitlementState;
  openHref: string | null;
  labelKey: string;
};

export type WorkspaceDashboardBundle = {
  organizationName: string | null;
  planLabel: string | null;
  licenseStatusLabel: string | null;
  generatedAt: string;
  modules: WorkspaceModuleCard[];
  activeModuleCount: number;
  setupModuleCount: number;
  tickets: WorkspaceTicketSummary;
  partner: WorkspacePartnerSummary;
  attention: Array<{ id: string; titleKey: string; href: string | null }>;
};
