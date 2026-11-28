/**
 * Phase C — shared APP surfaces, APP-host href mapping, and client perf contracts.
 * No SQL, no commercial activation, no Agent 3 Support/Redis edits.
 */

import { SALES_PARTNER_APP_MODULE_BASE } from "@/lib/sales-partner-app-migration/phase-a-contract";
import { SALES_PARTNER_THIN_HOSTS } from "@/lib/sales-partner-app-migration/phase-b-hosts";

export const SALES_PARTNER_APP_MIGRATION_PHASE_C = "C" as const;

/** Client abort budget for CSP portal / messages first paint (ms). */
export const CSP_PORTAL_CLIENT_FETCH_TIMEOUT_MS = 20_000;
export const CSP_MESSAGES_CLIENT_FETCH_TIMEOUT_MS = 15_000;
export const CSP_TOPBAR_UNREAD_TIMEOUT_MS = 12_000;

/**
 * Partners → APP host map for authenticated thin hosts.
 * Public verify / /p/* / /s/* stay outside this map.
 */
export const SALES_PARTNER_PARTNERS_TO_APP_HREF: Readonly<Record<string, string>> = {
  "/partners": SALES_PARTNER_APP_MODULE_BASE,
  "/partners/marketing/product-catalog": `${SALES_PARTNER_APP_MODULE_BASE}/products`,
  "/partners/referrals/links": `${SALES_PARTNER_APP_MODULE_BASE}/links`,
  "/partners/sales-page": `${SALES_PARTNER_APP_MODULE_BASE}/sales-page`,
  "/partners/customers/leads": `${SALES_PARTNER_APP_MODULE_BASE}/leads`,
  "/partners/customers/prospects": `${SALES_PARTNER_APP_MODULE_BASE}/customers`,
  "/partners/customers/pipeline": `${SALES_PARTNER_APP_MODULE_BASE}/pipeline`,
  "/partners/settlement": `${SALES_PARTNER_APP_MODULE_BASE}/commissions`,
  "/partners/academy/training": `${SALES_PARTNER_APP_MODULE_BASE}/academy`,
  "/partners/academy/certifications": `${SALES_PARTNER_APP_MODULE_BASE}/certificates`,
  "/partners/marketing/assets": `${SALES_PARTNER_APP_MODULE_BASE}/tools`,
  "/partners/marketing/assets?section=library": `${SALES_PARTNER_APP_MODULE_BASE}/materials`,
  "/partners/marketing/email-templates": `${SALES_PARTNER_APP_MODULE_BASE}/email-templates`,
  "/partners/account/messages": `${SALES_PARTNER_APP_MODULE_BASE}/messages`,
  "/partners/account/notifications": `${SALES_PARTNER_APP_MODULE_BASE}/notifications`,
  "/partners/account/profile": `${SALES_PARTNER_APP_MODULE_BASE}/profile`,
  "/partners/account/settings": `${SALES_PARTNER_APP_MODULE_BASE}/help`,
};

/** Shared APP surfaces — reuse when dual-role; CSP-specific data stays on module hosts. */
export const SALES_PARTNER_PHASE_C_SHARED_SURFACES = {
  notificationsApp: {
    href: "/app/notifications",
    parity: "unknown_without_signed_in_qa",
    interimHost: `${SALES_PARTNER_APP_MODULE_BASE}/notifications`,
  },
  profileApp: {
    href: "/app/profile",
    parity: "csp_payout_and_cert_remain_on_module_profile",
    interimHost: `${SALES_PARTNER_APP_MODULE_BASE}/profile`,
  },
  supportApp: {
    href: "/app/support",
    parity: "agent3_support_ticket_intake_fenced",
    interimHost: `${SALES_PARTNER_APP_MODULE_BASE}/help`,
  },
  knowledgePublic: {
    href: "/knowledge/articles",
    note: "Public KC for partner feedback policy — avoids customer APP login bounce",
  },
  feedback: {
    channel: "voice_of_the_customer",
    supportTicketIntegration: "BLOCKED_agent3_fence",
  },
} as const;

export function mapPartnersHrefToAppHost(href: string): string {
  const exact = SALES_PARTNER_PARTNERS_TO_APP_HREF[href];
  if (exact) return exact;
  const [path, query = ""] = href.split("?");
  if (path === "/partners/marketing/assets") {
    const section = new URLSearchParams(query).get("section");
    if (section === "library") return `${SALES_PARTNER_APP_MODULE_BASE}/materials`;
    return `${SALES_PARTNER_APP_MODULE_BASE}/tools`;
  }
  return href;
}

/** Normalize APP or partners pathname for active-nav matching. */
export function normalizeSalesPartnerPathname(pathname: string): string {
  if (pathname === SALES_PARTNER_APP_MODULE_BASE || pathname.startsWith(`${SALES_PARTNER_APP_MODULE_BASE}/`)) {
    const suffix = pathname.slice(SALES_PARTNER_APP_MODULE_BASE.length) || "";
    const reverse = Object.entries(SALES_PARTNER_PARTNERS_TO_APP_HREF).find(
      ([, app]) => app === pathname || app === `${SALES_PARTNER_APP_MODULE_BASE}${suffix}`,
    );
    if (reverse) {
      const partnersPath = reverse[0].split("?")[0]!;
      return partnersPath;
    }
  }
  return pathname;
}

export function salesPartnerPathIsActive(
  partnersOrAppHref: string,
  pathname: string,
  section: string | null,
): boolean {
  const appHref = mapPartnersHrefToAppHost(partnersOrAppHref);
  const [partnersPath, partnersQuery = ""] = partnersOrAppHref.split("?");
  const wanted = new URLSearchParams(partnersQuery).get("section");

  if (partnersPath === "/partners") {
    return pathname === "/partners" || pathname === SALES_PARTNER_APP_MODULE_BASE;
  }

  const appPath = appHref.split("?")[0]!;
  const onApp = pathname === appPath || pathname.startsWith(`${appPath}/`);
  const onPartners =
    pathname === partnersPath || pathname.startsWith(`${partnersPath}/`);

  if (!onApp && !onPartners) return false;

  if (wanted) {
    if (appPath.endsWith("/materials")) return onApp || section === "library";
    return section === wanted;
  }
  if (partnersPath === "/partners/marketing/assets") {
    return onApp
      ? appPath.endsWith("/tools")
      : section !== "library";
  }
  return true;
}

export function phaseCThinHostsIncludeShared(): boolean {
  const caps = new Set(SALES_PARTNER_THIN_HOSTS.map((h) => h.capability));
  // Phase C adds notifications / profile / help hosts beyond Phase B registry.
  return caps.has("messages");
}
