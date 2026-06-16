import type { SupportAssistantArticle, SupportAssistantLabels } from "./types";
import { SUPPORT_ASSISTANT_CORPUS_IDS } from "./types";

const FAQ_SLUG_MAP: Record<string, string> = {
  "contact-support": "contact-support",
  "invite-team-members": "invite-team-members",
  "manage-subscription": "change-subscriptions",
  "install-business-pack": "what-are-business-packs",
  "upgrade-plan": "upgrade-plan",
  "what-is-aipify": "what-is-aipify",
  "what-are-business-packs": "what-are-business-packs",
  "view-invoices": "view-invoices",
  "role-management": "role-management",
  "feature-access": "feature-access",
  "connect-integration": "connect-integration",
};

const MODULE_MAP: Record<string, string> = {
  "contact-support": "support",
  "connect-integration": "integrations",
  "manage-subscription": "billing",
  "invite-team-members": "organization",
  "install-business-pack": "business_packs",
  "upgrade-plan": "billing",
};

const CATEGORY_MAP: Record<string, string> = {
  "contact-support": "support",
  "connect-integration": "integrations",
  "manage-subscription": "billing",
  "invite-team-members": "organization",
  "install-business-pack": "business_packs",
  "upgrade-plan": "billing",
  "what-is-aipify": "general",
  "what-are-business-packs": "business_packs",
  "view-invoices": "billing",
  "role-management": "organization",
  "feature-access": "account",
};

function faqAnswer(t: (key: string) => string, slug: string): string {
  return t(`customerApp.portalStructure.faqAnswers.${slug}`);
}

function faqQuestion(t: (key: string) => string, slug: string): string {
  const keyMap: Record<string, string> = {
    "what-is-aipify": "customerApp.portalStructure.faq.whatIsAipify",
    "invite-team-members": "customerApp.portalStructure.faq.inviteTeamMembers",
    "change-subscriptions": "customerApp.portalStructure.faq.changeSubscriptions",
    "upgrade-plan": "customerApp.portalStructure.faq.upgradePlan",
    "what-are-business-packs": "customerApp.portalStructure.faq.whatAreBusinessPacks",
    "view-invoices": "customerApp.portalStructure.faq.viewInvoices",
    "contact-support": "customerApp.portalStructure.faq.contactSupport",
    "role-management": "customerApp.portalStructure.faq.roleManagement",
    "feature-access": "customerApp.portalStructure.faq.featureAccess",
  };
  return t(keyMap[slug] ?? `customerApp.portalStructure.supportAssistant.suggested.${slug}.title`);
}

export function buildSupportAssistantCorpus(
  labels: SupportAssistantLabels,
  t: (key: string) => string,
): SupportAssistantArticle[] {
  return SUPPORT_ASSISTANT_CORPUS_IDS.map((id) => {
    const suggested = labels.suggested[id];
    const faqSlug = FAQ_SLUG_MAP[id];
    const title = suggested?.title ?? (faqSlug ? faqQuestion(t, faqSlug) : id);
    const summary = suggested?.summary ?? (faqSlug ? faqAnswer(t, faqSlug) : "");
    const steps = suggested?.steps ?? [];
    const related = SUPPORT_ASSISTANT_CORPUS_IDS.filter((x) => x !== id)
      .slice(0, 3)
      .map((rid) => ({
        id: rid,
        title: labels.suggested[rid]?.title ?? faqQuestion(t, FAQ_SLUG_MAP[rid] ?? rid),
      }));

    return {
      id,
      title,
      summary,
      steps,
      category: CATEGORY_MAP[id] ?? "general",
      related_module: MODULE_MAP[id],
      related_articles: related,
      searchText: [title, summary, ...steps, id].join(" ").toLowerCase(),
    };
  });
}

export function searchSupportAssistantCorpus(
  query: string,
  corpus: SupportAssistantArticle[],
): SupportAssistantArticle[] {
  const q = query.trim().toLowerCase();
  if (!q) return corpus.filter((a) =>
    (["contact-support", "connect-integration", "manage-subscription"] as string[]).includes(a.id),
  );

  const scored = corpus
    .map((article) => {
      let score = 0;
      if (article.title.toLowerCase().includes(q)) score += 10;
      if (article.summary.toLowerCase().includes(q)) score += 5;
      if (article.searchText.includes(q)) score += 3;
      for (const word of q.split(/\s+/)) {
        if (word.length > 2 && article.searchText.includes(word)) score += 1;
      }
      return { article, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.article).slice(0, 8);
}

export function getSupportAssistantArticleById(
  id: string,
  corpus: SupportAssistantArticle[],
): SupportAssistantArticle | undefined {
  return corpus.find((a) => a.id === id);
}
