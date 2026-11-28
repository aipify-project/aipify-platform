/**
 * Sales Partner APP Shared Surfaces Complete V1 — Phase C finish.
 *
 * Shared APP surfaces are reused (no duplicates). Seller-specific payout,
 * certification, and partner settings stay under /app/sales-partner/*.
 * Messages remain module-local (Messaging Performance V1).
 */

import { SALES_PARTNER_APP_MODULE_BASE } from "@/lib/sales-partner-app-migration/phase-a-contract";
import { PARTNER_MESSAGES_APP_PATH } from "@/lib/sales-partner-app-migration/messaging-performance";

export const SALES_PARTNER_SHARED_SURFACES_COMPLETE_MARKER =
  "shared_surfaces_complete_v1" as const;

/** Canonical shared APP routes used by dual-role / CSP shell. */
export const SALES_PARTNER_SHARED_APP_SURFACES = {
  appProfile: {
    href: "/app/profile",
    role: "personal_account_profile",
    note: "Min profil / Kundeforhold — do not merge CSP payout or certification here",
  },
  appSupport: {
    href: "/app/support",
    role: "customer_support_center",
    note: "Kundeservice — dual-role; partner-specific tickets also via CSP contact when gate live",
  },
  appNotifications: {
    href: "/app/notifications",
    role: "shared_notifications",
    note: "Varsler — never CSP admin↔seller inbox",
  },
  appFeedback: {
    channel: "voice_of_the_customer",
    policyHref: "/knowledge/articles/customer-feedback-and-product-improvement",
    role: "share_feedback",
    note: "Del tilbakemelding — shared VoC; type + response preference kept in dialog",
  },
  knowledgeCenter: {
    href: "/knowledge/articles",
    role: "public_knowledge_center",
    note: "Public KC avoids APP login bounce for partners",
  },
} as const;

/** Seller-specific surfaces that must stay in the Sales Partner module. */
export const SALES_PARTNER_MODULE_ONLY_SURFACES = {
  partnerProfile: {
    href: `${SALES_PARTNER_APP_MODULE_BASE}/profile`,
    retains: ["payout_bank", "certification_status", "partner_company_fields"] as const,
  },
  partnerHelp: {
    href: `${SALES_PARTNER_APP_MODULE_BASE}/help`,
    retains: ["partner_guides", "csp_contact_when_gate_live"] as const,
  },
  partnerMessages: {
    href: PARTNER_MESSAGES_APP_PATH,
    retains: ["admin_seller_threads"] as const,
    neverMergeInto: "/app/support",
  },
  partnerMaterials: {
    href: `${SALES_PARTNER_APP_MODULE_BASE}/materials`,
  },
  partnerTools: {
    href: `${SALES_PARTNER_APP_MODULE_BASE}/tools`,
  },
} as const;

/**
 * Product feedback stays on VoC.
 * Support tickets: CSP contact panel posts to partner support-intake when gate live;
 * dual-role users also use shared /app/support. Do not edit Agent 3 support-intake gates.
 */
export const SALES_PARTNER_FEEDBACK_AND_SUPPORT_CONTRACT = {
  productFeedback: "voice_of_the_customer" as const,
  supportTickets: {
    dualRoleAppPath: "/app/support",
    partnerContactHost: `${SALES_PARTNER_APP_MODULE_BASE}/help/contact`,
    partnerApi: "/api/certified-sales-partner/support-intake",
    agent3Ownership: "support_intake_redis_public_channels",
    integrationNote:
      "Use existing CSP contact + gate; never fake success; never change Agent 3 files",
  },
} as const;

/** Help subsection partners paths → APP thin hosts. */
export const SALES_PARTNER_HELP_SUBPATH_MAP = {
  "/partners/account/help/getting-started": `${SALES_PARTNER_APP_MODULE_BASE}/help/getting-started`,
  "/partners/account/help/commission": `${SALES_PARTNER_APP_MODULE_BASE}/help/commission`,
  "/partners/account/help/contact": `${SALES_PARTNER_APP_MODULE_BASE}/help/contact`,
} as const;
