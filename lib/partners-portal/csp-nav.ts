import type { PartnersPortalNavGroup } from "./nav-config";

/**
 * Compact Certified Sales Partner menu.
 * Existing routes only — sections collapse in the shell.
 */
export const CSP_PARTNER_PORTAL_NAV_GROUPS: PartnersPortalNavGroup[] = [
  {
    id: "home",
    labelKey: "certifiedSalesPartner.navGroups.home",
    defaultExpanded: true,
    items: [{ id: "overview", href: "/partners", labelKey: "certifiedSalesPartner.nav.home" }],
  },
  {
    id: "sales",
    labelKey: "certifiedSalesPartner.navGroups.sales",
    items: [
      { id: "productCatalog", href: "/partners/marketing/product-catalog", labelKey: "certifiedSalesPartner.nav.products" },
      { id: "referralLinks", href: "/partners/referrals/links", labelKey: "certifiedSalesPartner.nav.salesLinks" },
      { id: "leads", href: "/partners/customers/leads", labelKey: "certifiedSalesPartner.nav.leads" },
      { id: "prospects", href: "/partners/customers/prospects", labelKey: "certifiedSalesPartner.nav.customers" },
      { id: "pipeline", href: "/partners/customers/pipeline", labelKey: "certifiedSalesPartner.nav.sales" },
    ],
  },
  {
    id: "commission",
    labelKey: "certifiedSalesPartner.navGroups.commission",
    items: [
      { id: "settlementPortal", href: "/partners/settlement", labelKey: "certifiedSalesPartner.nav.commissionPayouts" },
    ],
  },
  {
    id: "academy",
    labelKey: "certifiedSalesPartner.navGroups.academy",
    items: [
      { id: "trainingPrograms", href: "/partners/academy/training", labelKey: "certifiedSalesPartner.nav.growthAcademy" },
      { id: "certifications", href: "/partners/academy/certifications", labelKey: "certifiedSalesPartner.nav.certifications" },
    ],
  },
  {
    id: "marketing",
    labelKey: "certifiedSalesPartner.navGroups.marketing",
    items: [
      { id: "marketingAssets", href: "/partners/marketing/assets", labelKey: "certifiedSalesPartner.nav.salesTools" },
      {
        id: "salesMaterials",
        href: "/partners/marketing/assets?section=library",
        labelKey: "certifiedSalesPartner.nav.salesMaterials",
      },
    ],
  },
  {
    id: "communication",
    labelKey: "certifiedSalesPartner.navGroups.communication",
    items: [
      { id: "messages", href: "/partners/account/messages", labelKey: "certifiedSalesPartner.nav.messages" },
      { id: "notifications", href: "/partners/account/notifications", labelKey: "certifiedSalesPartner.nav.notifications" },
      { id: "settings", href: "/partners/account/settings", labelKey: "certifiedSalesPartner.nav.help" },
    ],
  },
  {
    id: "account",
    labelKey: "certifiedSalesPartner.navGroups.account",
    items: [{ id: "profile", href: "/partners/account/profile", labelKey: "certifiedSalesPartner.nav.profile" }],
  },
];
