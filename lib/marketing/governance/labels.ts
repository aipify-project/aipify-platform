import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import { COMPANY_CONFIG } from "@/lib/company/company.config";
import { recordValues } from "@/lib/marketing/parse-marketing";
import { buildMarketingSearchIndex } from "./search-index";

type Translator = (key: string) => string;

export function parseDigitalHeadquartersPageLabels(marketing: MarketingDictionary, key: string) {
  const section = (marketing.digitalHeadquarters ?? {}) as Record<string, Record<string, unknown>>;
  const page = (section[key] ?? {}) as Record<string, unknown>;
  return {
    meta: {
      title: String((page.meta as Record<string, string>)?.title ?? ""),
      description: String((page.meta as Record<string, string>)?.description ?? ""),
    },
    title: String(page.title ?? ""),
    subtitle: String(page.subtitle ?? ""),
    intro: String(page.intro ?? ""),
    sections: recordValues(page.sections as Record<string, { title: string; body: string }> | undefined),
    futureItems: recordValues(page.futureTypes as Record<string, string> | undefined),
    emptyMessage: String(page.emptyMessage ?? ""),
    ctaPrimary: String(page.ctaPrimary ?? ""),
    ctaSecondary: String(page.ctaSecondary ?? ""),
    ctaHref: String(page.ctaHref ?? "/contact"),
    ctaSecondaryHref: String(page.ctaSecondaryHref ?? "/book-demo"),
    variant: (page.variant as "full" | "scaffold" | undefined) ?? (key === "company" ? "full" : "scaffold"),
  };
}

export function parseContactExperienceLabels(marketing: MarketingDictionary) {
  const contact = (marketing.contactExperience ?? marketing.contact ?? {}) as Record<string, unknown>;
  const paths = (contact.paths ?? {}) as Record<string, { title?: string; description?: string; href?: string; email?: string }>;
  return {
    title: String(contact.title ?? ""),
    subtitle: String(contact.subtitle ?? ""),
    continueLabel: String(contact.continueLabel ?? "Continue"),
    paths: Object.entries(paths).map(([id, p]) => ({
      id,
      title: String(p.title ?? id),
      description: String(p.description ?? ""),
      href: String(p.href ?? "/contact"),
      email: p.email ? String(p.email) : undefined,
    })),
  };
}

export function parseWebsiteSearchLabels(marketing: MarketingDictionary) {
  const search = (marketing.websiteSearch ?? {}) as Record<string, string>;
  return {
    placeholder: String(search.placeholder ?? "Search"),
    noResults: String(search.noResults ?? "No results found."),
  };
}

export function buildMarketingSearchFromDictionary(marketing: MarketingDictionary) {
  const pk = (marketing.publicKnowledge ?? {}) as Record<string, unknown>;
  const articles = (pk.articles ?? {}) as Record<string, { title?: string; metaDescription?: string }>;
  const articleTitles = Object.fromEntries(
    Object.entries(articles).map(([slug, article]) => [
      slug,
      { title: String(article.title ?? slug), metaDescription: String(article.metaDescription ?? "") },
    ])
  );
  const packs = (pk.businessPacks ?? {}) as Record<string, { name?: string }>;
  const packNames = Object.fromEntries(
    Object.entries(packs).map(([slug, pack]) => [slug, String(pack.name ?? slug)])
  );
  return buildMarketingSearchIndex(articleTitles, packNames);
}

export function parseWebsiteCompanionLabels(marketing: MarketingDictionary) {
  const c = (marketing.websiteCompanion ?? {}) as Record<string, unknown>;
  const chat = (c.chat ?? {}) as Record<string, unknown>;
  const publicLinksRaw = (chat.publicLinks ?? {}) as Record<string, string>;
  const actions = (c.actions ?? {}) as Record<string, { label?: string; href?: string; description?: string }>;
  const statesRaw = (c.states ?? {}) as Record<string, string>;
  const states = {
    READY: String(statesRaw.READY ?? "Ready"),
    WORKING: String(statesRaw.WORKING ?? "Working"),
    COMPLETED: String(statesRaw.COMPLETED ?? "Completed"),
    APPROVAL_REQUIRED: String(statesRaw.APPROVAL_REQUIRED ?? "Approval required"),
    CRITICAL: String(statesRaw.CRITICAL ?? "Critical alert"),
    DISCONNECTED: String(statesRaw.DISCONNECTED ?? "Disconnected"),
    QUIET_HOURS: String(statesRaw.QUIET_HOURS ?? "Quiet hours"),
  };
  return {
    title: String(c.title ?? "Aipify"),
    prompt: String(c.prompt ?? ""),
    presenceLabel: String(c.presenceLabel ?? "Companion status"),
    chat: {
      welcome: String(chat.welcome ?? ""),
      inputPlaceholder: String(chat.inputPlaceholder ?? ""),
      send: String(chat.send ?? "Send"),
      sendAria: String(chat.sendAria ?? (chat.send as string | undefined) ?? "Send"),
      sending: String(chat.sending ?? ""),
      retry: String(chat.retry ?? "Try again"),
      genericError: String(chat.genericError ?? ""),
      sources: String(chat.sources ?? "Sources"),
      goToLatest: String(chat.goToLatest ?? "Go to latest message"),
      goToLatestAria: String(chat.goToLatestAria ?? chat.goToLatest ?? "Go to latest message"),
      charactersRemaining: String(chat.charactersRemaining ?? "{count} characters remaining"),
      open: String(chat.open ?? "Open {title}"),
      close: String(chat.close ?? "Close {title}"),
      quickLinks: String(chat.quickLinks ?? "Quick links"),
      publicLinks: {
        businessPacks: String(publicLinksRaw.businessPacks ?? "Explore Business Packs"),
        becomePartner: String(publicLinksRaw.becomePartner ?? "Become a partner"),
      },
    },
    states,
    actions: Object.entries(actions).map(([id, a]) => ({
      id,
      label: String(a.label ?? id),
      href: String(a.href ?? "/"),
      description: String(a.description ?? ""),
    })),
  };
}

export function buildWebsiteGovernancePanelLabels(t: Translator) {
  const p = "platform.websiteGovernance";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    governanceTitle: t(`${p}.governanceTitle`),
    brandLanguageTitle: t(`${p}.brandLanguageTitle`),
    designTitle: t(`${p}.designTitle`),
    healthTitle: t(`${p}.healthTitle`),
    completionTitle: t(`${p}.completionTitle`),
    principleTitle: t(`${p}.principleTitle`),
    transitionTitle: t(`${p}.transitionTitle`),
    approvedTerms: t(`${p}.approvedTerms`),
    forbiddenTerms: t(`${p}.forbiddenTerms`),
    rules: t(`${p}.rules`),
    principles: t(`${p}.principles`),
    transitionNote: t(`${p}.transitionNote`),
    websiteIntelligenceLink: t(`${p}.websiteIntelligenceLink`),
    checkpoints: Object.fromEntries(
      ["website_foundation", "brand_foundation", "trust_foundation", "conversion_foundation", "growth_partner_foundation", "seo_foundation", "analytics_foundation", "governance_foundation"].map(
        (id) => [id, t(`${p}.checkpoints.${id}`)]
      )
    ),
    healthChecks: Object.fromEntries(
      ["broken_links", "missing_pages", "performance", "accessibility", "seo_health", "localization_coverage", "conversion_paths"].map(
        (id) => [id, t(`${p}.healthChecks.${id}`)]
      )
    ),
  };
}

export function parseFooterGovernanceLabels(marketing: MarketingDictionary) {
  const footer = (marketing.footer ?? {}) as Record<string, string>;
  return {
    ...footer,
    products: footer.products ?? footer.product ?? "Products",
    product: footer.product ?? footer.products ?? "Product",
    businessPacks: footer.businessPacks ?? "Business Packs",
    enterprise: footer.enterprise ?? "Enterprise",
    growthPartners: footer.growthPartners ?? "Growth Partners",
    knowledge: footer.knowledge ?? "Knowledge",
    resources: footer.resources ?? "Resources",
    security: footer.security ?? "Security",
    privacy: footer.privacy ?? "Privacy",
    terms: footer.terms ?? "Terms",
    contact: footer.contact ?? "Contact",
    company: footer.company ?? "Company",
    careers: footer.careers ?? "Careers",
    media: footer.media ?? "Media",
    companyPage: footer.companyPage ?? "About Aipify",
    legal: footer.legal ?? "Legal",
    growthPartnerTerms: footer.growthPartnerTerms ?? "Growth Partner Terms",
    companyName: footer.companyName ?? "Aipify Group AS",
    organizationNumberLabel: footer.organizationNumberLabel ?? "Org. no.",
    organizationNumberDisplay:
      footer.organizationNumberDisplay ?? COMPANY_CONFIG.organizationNumberDisplay,
    headquarters: footer.headquarters ?? "Bergen, Norway",
    businessOperatingSystem: footer.businessOperatingSystem ?? "Business Operating System",
    tagline: footer.tagline ?? "",
    privacyNote: footer.privacyNote ?? "",
    copyright: footer.copyright ?? "",
    brandSignatureLine1: footer.brandSignatureLine1 ?? "Aipify Group AS",
    finalSignature: footer.finalSignature ?? "Bergen. Norway. For the world.",
    languageRegion: footer.languageRegion ?? "Language & region",
    languageRegionHint: footer.languageRegionHint ?? "Choose your preferred language.",
    languageActive: footer.languageActive ?? "Active language",
    languageChange: footer.languageChange ?? "Change language",
    languageComingLater: footer.languageComingLater ?? "Coming later",
    languageSwitchFailed: footer.languageSwitchFailed ?? "Language switch failed.",
    languageRetry: footer.languageRetry ?? "Retry",
  };
}
