/**
 * Job 58 — unambiguous route bindings for the foundation APP nav.
 * No duplicate hrefs across the visible menu. /app/kompis stays out of primary nav.
 */

export const FOUNDATION_NAV_BINDINGS = {
  appHome: "/app",
  kompisWebDashboard: "/app/website-kompis",
  kompisWebQa: "/app/website-kompis/feedback",
  kompisWebFaq: "/app/website-kompis/faq",
  kompisWebConnection: "/app/domains",
  kompisWebAppearance: "/app/website-kompis/appearance",
  kompisWebModules: "/app/software",
  kompisWebSettings: "/app/website-kompis/settings",
  kompisBedriftDashboard: "/app/organization",
  kompisBedriftEmployees: "/app/organization/team",
  kompisBedriftDocuments: "/app/documents",
  kompisBedriftFaq: "/app/settings/employee-knowledge",
  kompisBedriftComms: "/app/organization/communications",
  kompisBedriftMeetings: "/app/operations/meetings",
  kompisBedriftModules: "/app/settings/modules",
  kompisBedriftSettings: "/app/settings",
  accountSubscription: "/app/settings/billing",
  accountInvoices: "/app/settings/billing/invoice-details",
  accountIntegrations: "/app/platform/integrations/connected",
  accountNotifications: "/app/account/notification-settings",
  /** Preserved operator — not primary nav; linked from Web hub only. */
  kompisOperatorPreserved: "/app/kompis",
} as const;

export type FoundationNavBindingId = keyof typeof FOUNDATION_NAV_BINDINGS;
