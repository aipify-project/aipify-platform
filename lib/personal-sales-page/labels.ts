export type PersonalSalesLabels = {
  metaTitle: string;
  metaDescription: string;
  unavailableTitle: string;
  unavailableBody: string;
  recommendedBy: string;
  heroTitle: string;
  heroLead: string;
  startFree: string;
  seeHow: string;
  benefitTitle: string;
  benefits: string[];
  priceTitle: string;
  pricePlanned: string;
  priceMissing: string;
  perMonth: string;
  perYear: string;
  noCheckout: string;
  productTitle: string;
  productUnavailable: string;
  closedCta: string;
  previewTitle: string;
  previewBody: string;
  attributionLink: string;
  personalLink: string;
  copy: string;
  copied: string;
  open: string;
  notMeasured: string;
  notAvailable: string;
  gateBlocked: string;
  noLink: string;
  platformTitle: string;
  platformBody: string;
  publishedLinksUnavailable: string;
  partners: string;
  publishedProducts: string;
  registrations: string;
  sales: string;
  interestTitle: string;
  interestPending: string;
  interestPrivacy: string;
  interestName: string;
  interestEmail: string;
  interestAcknowledgement: string;
  interestSaved: string;
  privacyLink: string;
  platformInterestTitle: string;
  platformInterestBody: string;
  platformInterestEmpty: string;
  pagePending: string;
  share: string;
  seeLeads: string;
  leadsNote: string;
};

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function list(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length >= 3 ? items : fallback;
}

const EN: PersonalSalesLabels = {
  metaTitle: "Aipify",
  metaDescription: "A personal introduction to Aipify. Product details stay on the published Aipify page.",
  unavailableTitle: "This personal page is not available",
  unavailableBody: "The link is not an active published partner page. Aipify remains available without a partner attribution.",
  recommendedBy: "Recommended by {name}",
  heroTitle: "A calmer way to run customer conversations",
  heroLead: "Aipify prepares the product experience. A partner can introduce it. Checkout is not started from this page.",
  startFree: "Start free",
  seeHow: "See how it works",
  benefitTitle: "What you can do",
  benefits: [
    "Answer visitors from the published website",
    "Keep the same Aipify product story in every language",
    "Start only through the existing registration path",
  ],
  priceTitle: "Published reference prices",
  pricePlanned: "These amounts are the published catalog reference. They are not a live checkout.",
  priceMissing: "Price is not available",
  perMonth: "per month",
  perYear: "per year",
  noCheckout: "No payment is taken on this page.",
  productTitle: "Product",
  productUnavailable: "This product is not available on the personal page.",
  closedCta: "Continue to Aipify",
  previewTitle: "My sales page",
  previewBody: "The public page uses your existing partner code. A named recommendation is shown only when the public link is verified.",
  attributionLink: "Sales link",
  personalLink: "Personal page",
  copy: "Copy",
  copied: "Copied",
  open: "Open",
  notMeasured: "Not measured yet",
  notAvailable: "Not available",
  gateBlocked: "The sales link stays closed until approval, certification, and a published product are in place.",
  noLink: "No personal link is issued yet.",
  platformTitle: "Personal sales pages",
  platformBody: "Availability comes from the existing seller overview. This screen does not publish, email, or change commission.",
  publishedLinksUnavailable: "Published partner links are not available",
  partners: "Partners",
  publishedProducts: "Published products",
  registrations: "Registrations",
  sales: "Sales",
  interestTitle: "Be contacted",
  interestPending: "Interest registration is not active yet. Nothing is stored from this page.",
  interestPrivacy: "When registration opens, the interest is sent only to the named Aipify seller for follow-up. It is not a sale and it is not marketing consent.",
  interestName: "Name",
  interestEmail: "Email",
  interestAcknowledgement: "I want this seller to contact me about this product.",
  interestSaved: "Your interest is stored for the seller.",
  privacyLink: "Privacy",
  platformInterestTitle: "Personal page interests",
  platformInterestBody: "Contact details stay in this administration view. They are not part of public counts.",
  platformInterestEmpty: "No interest has been stored yet.",
  pagePending: "The named landing page is not published for this code yet.",
  share: "Share",
  seeLeads: "See my leads",
  leadsNote: "Leads, customers, sales, and commission stay separate.",
};

export function parsePersonalSalesLabels(source: unknown): PersonalSalesLabels {
  const row = source && typeof source === "object" ? (source as Record<string, unknown>) : {};
  return {
    metaTitle: text(row.metaTitle, EN.metaTitle),
    metaDescription: text(row.metaDescription, EN.metaDescription),
    unavailableTitle: text(row.unavailableTitle, EN.unavailableTitle),
    unavailableBody: text(row.unavailableBody, EN.unavailableBody),
    recommendedBy: text(row.recommendedBy, EN.recommendedBy),
    heroTitle: text(row.heroTitle, EN.heroTitle),
    heroLead: text(row.heroLead, EN.heroLead),
    startFree: text(row.startFree, EN.startFree),
    seeHow: text(row.seeHow, EN.seeHow),
    benefitTitle: text(row.benefitTitle, EN.benefitTitle),
    benefits: list(row.benefits, EN.benefits),
    priceTitle: text(row.priceTitle, EN.priceTitle),
    pricePlanned: text(row.pricePlanned, EN.pricePlanned),
    priceMissing: text(row.priceMissing, EN.priceMissing),
    perMonth: text(row.perMonth, EN.perMonth),
    perYear: text(row.perYear, EN.perYear),
    noCheckout: text(row.noCheckout, EN.noCheckout),
    productTitle: text(row.productTitle, EN.productTitle),
    productUnavailable: text(row.productUnavailable, EN.productUnavailable),
    closedCta: text(row.closedCta, EN.closedCta),
    previewTitle: text(row.previewTitle, EN.previewTitle),
    previewBody: text(row.previewBody, EN.previewBody),
    attributionLink: text(row.attributionLink, EN.attributionLink),
    personalLink: text(row.personalLink, EN.personalLink),
    copy: text(row.copy, EN.copy),
    copied: text(row.copied, EN.copied),
    open: text(row.open, EN.open),
    notMeasured: text(row.notMeasured, EN.notMeasured),
    notAvailable: text(row.notAvailable, EN.notAvailable),
    gateBlocked: text(row.gateBlocked, EN.gateBlocked),
    noLink: text(row.noLink, EN.noLink),
    platformTitle: text(row.platformTitle, EN.platformTitle),
    platformBody: text(row.platformBody, EN.platformBody),
    publishedLinksUnavailable: text(row.publishedLinksUnavailable, EN.publishedLinksUnavailable),
    partners: text(row.partners, EN.partners),
    publishedProducts: text(row.publishedProducts, EN.publishedProducts),
    registrations: text(row.registrations, EN.registrations),
    sales: text(row.sales, EN.sales),
    interestTitle: text(row.interestTitle, EN.interestTitle),
    interestPending: text(row.interestPending, EN.interestPending),
    interestPrivacy: text(row.interestPrivacy, EN.interestPrivacy),
    interestName: text(row.interestName, EN.interestName),
    interestEmail: text(row.interestEmail, EN.interestEmail),
    interestAcknowledgement: text(row.interestAcknowledgement, EN.interestAcknowledgement),
    interestSaved: text(row.interestSaved, EN.interestSaved),
    privacyLink: text(row.privacyLink, EN.privacyLink),
    platformInterestTitle: text(row.platformInterestTitle, EN.platformInterestTitle),
    platformInterestBody: text(row.platformInterestBody, EN.platformInterestBody),
    platformInterestEmpty: text(row.platformInterestEmpty, EN.platformInterestEmpty),
    pagePending: text(row.pagePending, EN.pagePending),
    share: text(row.share, EN.share),
    seeLeads: text(row.seeLeads, EN.seeLeads),
    leadsNote: text(row.leadsNote, EN.leadsNote),
  };
}
