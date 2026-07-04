import { isPlatformProductKnowledgeQuery } from "@/lib/companion-platform-knowledge/platform-product-foundation";
import {
  buildPlatformAnswer,
  resolvePlatformCorpus,
} from "@/lib/companion-platform-knowledge/answer-builder";
import { PLATFORM_KNOWLEDGE_CORPUS } from "@/lib/companion-platform-knowledge/platform-corpus";
import type {
  PlatformCorpusArticleId,
  PlatformSearchResult,
} from "@/lib/companion-platform-knowledge/types";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";
import { resolveCompanionPageLabelKey } from "@/lib/app/companion/context-suggestions";
import type { Translator } from "@/lib/i18n/translate";
import type { UserRole } from "@/lib/tenant/types";
import {
  buildAppCompanionSubmitPageContext,
  isCompanionSubmitPageContextQuestion,
  type CompanionSubmitPageContext,
} from "./companion-submit-page-context";

const APP_PAGE_LABEL_CORPUS: Partial<Record<string, PlatformCorpusArticleId>> = {
  commandCenter: "command-brief",
  support: "knowledge-center",
  integrations: "connect-system",
  integrationSetup: "connect-system",
  billing: "my-subscription",
  businessPacks: "business-packs",
  notifications: "notifications-preferences",
  sinceLastLogin: "since-last-login",
  organization: "add-team-members",
  operations: "command-brief",
};

export function resolveAppPageCorpusArticleId(pathname: string): PlatformCorpusArticleId | null {
  const pageLabelKey = resolveCompanionPageLabelKey(pathname);
  return APP_PAGE_LABEL_CORPUS[pageLabelKey] ?? null;
}

export function resolveAppCompanionSubmitPageContextFromPathname(
  pathname: string | null | undefined,
): CompanionSubmitPageContext | undefined {
  if (!pathname?.trim()) return undefined;
  return buildAppCompanionSubmitPageContext(pathname);
}

export function tryBuildAppPageContextSearchResult(input: {
  question: string;
  pageContext?: CompanionSubmitPageContext;
  t: Translator;
  labels: CompanionExperienceLabels;
  userRole: UserRole;
}): PlatformSearchResult | null {
  const pageContext = input.pageContext;
  if (!pageContext?.pathname || pageContext.surface !== "app") {
    return null;
  }
  if (isPlatformProductKnowledgeQuery(input.question)) {
    return null;
  }

  const pageLabelKey = resolveCompanionPageLabelKey(pageContext.pathname);
  const pageLabel = input.labels.contextPages[pageLabelKey] ?? input.labels.contextPages.default;
  const corpusArticleId = resolveAppPageCorpusArticleId(pageContext.pathname);
  if (!corpusArticleId) {
    return null;
  }

  if (
    !isCompanionSubmitPageContextQuestion(
      input.question,
      { title: pageLabel, slug: pageLabelKey },
      pageContext,
    )
  ) {
    return null;
  }

  const corpus = resolvePlatformCorpus(PLATFORM_KNOWLEDGE_CORPUS, input.t, () => []);
  const article = corpus.find((entry) => entry.id === corpusArticleId);
  if (!article) {
    return null;
  }

  return {
    matchedArticleId: article.id,
    answer: buildPlatformAnswer(
      article,
      input.t,
      { userRole: input.userRole },
      {
        source: "platform_corpus",
        confidence: "high",
      },
    ),
  };
}
