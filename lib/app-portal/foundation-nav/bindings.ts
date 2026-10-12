/**
 * Canonical APP foundation route bindings (jobs 58–60).
 * Flat product menus share Faktura/Abonnement account routes.
 */

export const FOUNDATION_NAV_BINDINGS = {
  appHome: "/app",
  kompisWebDashboard: "/app/website-kompis",
  kompisWebQa: "/app/website-kompis/feedback",
  kompisWebFaq: "/app/website-kompis/faq",
  kompisWebConnection: "/app/website-kompis/connection",
  kompisWebAppearance: "/app/website-kompis/appearance",
  kompisWebModules: "/app/software",
  kompisWebSettings: "/app/website-kompis/settings",
  kompisBedriftDashboard: "/app/kompis-bedrift",
  kompisBedriftEmployees: "/app/kompis-bedrift/employees",
  kompisBedriftDocuments: "/app/kompis-bedrift/documents",
  kompisBedriftFaq: "/app/kompis-bedrift/knowledge",
  kompisBedriftComms: "/app/kompis-bedrift/communications",
  kompisBedriftMeetings: "/app/kompis-bedrift/meetings",
  kompisBedriftModules: "/app/kompis-bedrift/modules",
  kompisBedriftConnection: "/app/kompis-bedrift/connection",
  kompisBedriftSettings: "/app/kompis-bedrift/settings",
  accountHome: "/app/account",
  accountSubscription: "/app/account/subscription",
  accountInvoices: "/app/account/invoices",
  accountIntegrations: "/app/account/integrations",
  accountNotifications: "/app/account/notifications",
  /** Preserved operator — not primary nav; linked from Web settings/hub. */
  kompisOperatorPreserved: "/app/kompis",
  /** Legacy domain connection surface (linked from Web connection hub). */
  kompisWebDomainsLegacy: "/app/domains",
} as const;

export type FoundationNavBindingId = keyof typeof FOUNDATION_NAV_BINDINGS;
