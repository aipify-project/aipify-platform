/**
 * Canonical APP foundation nav bindings (jobs 58–59).
 * Visible menu hrefs are unique. /app/kompis stays out of primary nav.
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
  kompisBedriftDashboard: "/app/kompis-bedrift",
  kompisBedriftEmployees: "/app/kompis-bedrift/employees",
  kompisBedriftDocuments: "/app/kompis-bedrift/documents",
  kompisBedriftFaq: "/app/kompis-bedrift/knowledge",
  kompisBedriftComms: "/app/kompis-bedrift/communications",
  kompisBedriftMeetings: "/app/kompis-bedrift/meetings",
  kompisBedriftModules: "/app/kompis-bedrift/modules",
  kompisBedriftSettings: "/app/kompis-bedrift/settings",
  accountHome: "/app/account",
  accountSubscription: "/app/account/subscription",
  accountInvoices: "/app/account/invoices",
  accountIntegrations: "/app/account/integrations",
  accountNotifications: "/app/account/notifications",
  /** Preserved operator — not primary nav; linked from Web hub only. */
  kompisOperatorPreserved: "/app/kompis",
} as const;

export type FoundationNavBindingId = keyof typeof FOUNDATION_NAV_BINDINGS;
