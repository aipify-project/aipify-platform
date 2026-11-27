/**
 * Presentation copy for the partner sales experience.
 * Visible words come from locale files. This module only selects keys and routes.
 */
import type { Translator } from "@/lib/i18n/translate";
import type {
  CommissionStepModel,
  EmptyStateModel,
  ExplainerCardModel,
  GuidanceStepModel,
  HelpCategoryModel,
  LearningStageModel,
  SalesHeroModel,
  SuggestionModel,
} from "@/components/partners-portal/sales-experience";

const NS = "partnersPortal.certifiedSalesPartner.salesExperience";
const GUIDE = "partnersPortal.certifiedSalesPartner.guides.commission";

type StepId = "product" | "need" | "link" | "review";
type TalkId = "find" | "contact" | "listen" | "show" | "share" | "follow";

const START_STEPS: { id: StepId; icon: GuidanceStepModel["icon"]; href: string }[] = [
  { id: "product", icon: "product", href: "/partners/marketing/product-catalog" },
  { id: "need", icon: "need", href: "/partners/marketing/assets" },
  { id: "link", icon: "link", href: "/partners/referrals/links" },
  { id: "review", icon: "commission", href: "/partners/customers/pipeline" },
];

const TALK_STEPS: { id: TalkId; icon: GuidanceStepModel["icon"]; href: string }[] = [
  { id: "find", icon: "search", href: "/partners/marketing/product-catalog" },
  { id: "contact", icon: "message", href: "/partners/marketing/email-templates" },
  { id: "listen", icon: "listen", href: "/partners/marketing/assets" },
  { id: "show", icon: "present", href: "/partners/marketing/product-catalog" },
  { id: "share", icon: "link", href: "/partners/referrals/links" },
  { id: "follow", icon: "follow", href: "/partners/customers/leads" },
];

const CATEGORIES: { id: string; href?: string }[] = [
  { id: "start", href: "/partners/marketing/email-templates" },
  { id: "questions" },
  { id: "value" },
  { id: "objections" },
  { id: "followUp", href: "/partners/marketing/email-templates" },
  { id: "commission", href: "/partners/account/help/commission" },
];

const COMMISSION_GUIDE_TOPICS = ["monthly", "renewals", "refunds", "payout"] as const;

const TIMELINE = ["registered", "qualifying", "earned", "approved", "paid"] as const;

function step(t: Translator, group: string, id: string, icon: GuidanceStepModel["icon"], href: string, index: number): GuidanceStepModel {
  const base = `${NS}.${group}.${id}`;
  return {
    id,
    icon,
    indexLabel: String(index + 1).padStart(2, "0"),
    title: t(`${base}.title`),
    summary: t(`${base}.summary`),
    why: t(`${base}.why`),
    say: t(`${base}.say`),
    example: t(`${base}.example`),
    action: { href, label: t(`${base}.action`) },
  };
}

export function buildHomeExperience(t: Translator): {
  hero: SalesHeroModel;
  stepsLabel: string;
  whyLabel: string;
  sayLabel: string;
  exampleLabel: string;
  notice: string;
  steps: GuidanceStepModel[];
  suggestionsTitle: string;
  suggestionNotice: string;
  suggestions: SuggestionModel[];
  metricsNote: string;
} {
  return {
    hero: {
      title: t(`${NS}.hero.homeTitle`),
      support: t(`${NS}.hero.homeSupport`),
      actions: [
        { href: "/partners/marketing/product-catalog", label: t(`${NS}.actions.products`) },
        { href: "/partners/marketing/assets", label: t(`${NS}.actions.tools`) },
        { href: "/partners/referrals/links", label: t(`${NS}.actions.links`) },
      ],
    },
    stepsLabel: t(`${NS}.start.title`),
    whyLabel: t(`${NS}.labels.why`),
    sayLabel: t(`${NS}.labels.say`),
    exampleLabel: t(`${NS}.labels.example`),
    notice: t(`${NS}.guidanceNotice`),
    steps: START_STEPS.map((item, index) => step(t, "start", item.id, item.icon, item.href, index)),
    suggestionsTitle: t(`${NS}.today.title`),
    suggestionNotice: t(`${NS}.suggestionNotice`),
    suggestions: (
      [
        ["reviewProduct", "/partners/marketing/product-catalog"],
        ["readQuestion", "/partners/marketing/assets"],
        ["checkLink", "/partners/referrals/links"],
      ] as const
    ).map(([id, href]) => ({
      id,
      title: t(`${NS}.today.${id}.title`),
      body: t(`${NS}.today.${id}.body`),
      action: { href, label: t(`${NS}.today.${id}.action`) },
    })),
    metricsNote: t(`${NS}.metricsNote`),
  };
}

export function buildProductExperience(t: Translator): {
  hero: SalesHeroModel;
  readMore: string;
  close: string;
  share: string;
  knowLabel: string;
  know: string;
  imageAlt: string;
} {
  return {
    hero: {
      title: t(`${NS}.hero.productsTitle`),
      support: t(`${NS}.hero.productsSupport`),
      notice: t(`${NS}.guidanceNotice`),
    },
    readMore: t(`${NS}.actions.readMore`),
    close: t(`${NS}.actions.close`),
    share: t(`${NS}.actions.shareProduct`),
    knowLabel: t(`${NS}.knowLabel`),
    know: t(`${NS}.know`),
    imageAlt: t(`${NS}.imageAlt`),
  };
}

export function buildToolsExperience(t: Translator): {
  hero: SalesHeroModel;
  stepsLabel: string;
  whyLabel: string;
  sayLabel: string;
  exampleLabel: string;
  notice: string;
  steps: GuidanceStepModel[];
  categoriesTitle: string;
  categories: HelpCategoryModel[];
  approvedLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
} {
  return {
    hero: {
      title: t(`${NS}.hero.toolsTitle`),
      support: t(`${NS}.hero.toolsSupport`),
    },
    stepsLabel: t(`${NS}.talk.title`),
    whyLabel: t(`${NS}.labels.why`),
    sayLabel: t(`${NS}.labels.say`),
    exampleLabel: t(`${NS}.labels.example`),
    notice: t(`${NS}.guidanceNotice`),
    steps: TALK_STEPS.map((item, index) => step(t, "talk", item.id, item.icon, item.href, index)),
    categoriesTitle: t(`${NS}.categoriesTitle`),
    categories: CATEGORIES.map((item) => ({
      id: item.id,
      title: t(`${NS}.categories.${item.id}.title`),
      body: t(`${NS}.categories.${item.id}.body`),
      action: item.href
        ? { href: item.href, label: t(`${NS}.categories.${item.id}.action`) }
        : undefined,
    })),
    approvedLabel: t(`${NS}.approvedLabel`),
    copy: t(`${NS}.actions.copy`),
    copied: t(`${NS}.actions.copied`),
    copyFailed: t(`${NS}.actions.copyFailed`),
  };
}

export function buildAcademyExperience(t: Translator): {
  title: string;
  support: string;
  learnedStatus: string;
  passedStatus: string;
  notPassedStatus: string;
  sellStatus: string;
  stages: LearningStageModel[];
} {
  const learnedStatus = t(`${NS}.academy.learnedStatus`);
  const passedStatus = t(`${NS}.academy.passedStatus`);
  const notPassedStatus = t(`${NS}.academy.notPassedStatus`);
  const sellStatus = t(`${NS}.academy.sellStatus`);
  return {
    title: t(`${NS}.hero.academyTitle`),
    support: t(`${NS}.hero.academySupport`),
    learnedStatus,
    passedStatus,
    notPassedStatus,
    sellStatus,
    stages: [
      {
        id: "learn",
        title: t(`${NS}.academy.learn.title`),
        body: t(`${NS}.academy.learn.body`),
        status: learnedStatus,
        action: { href: "/partners/academy/training", label: t(`${NS}.academy.learn.action`) },
      },
      {
        id: "pass",
        title: t(`${NS}.academy.pass.title`),
        body: t(`${NS}.academy.pass.body`),
        status: notPassedStatus,
        action: { href: "/partners/academy/certifications", label: t(`${NS}.academy.pass.action`) },
      },
      {
        id: "sell",
        title: t(`${NS}.academy.sell.title`),
        body: t(`${NS}.academy.sell.body`),
        status: sellStatus,
        action: { href: "/partners/marketing/product-catalog", label: t(`${NS}.academy.sell.action`) },
      },
    ],
  };
}

export function buildCommissionExperience(t: Translator): {
  hero: SalesHeroModel;
  timelineTitle: string;
  steps: CommissionStepModel[];
  rules: ExplainerCardModel[];
  notes: string[];
} {
  return {
    hero: {
      title: t(`${NS}.hero.commissionTitle`),
      support: t(`${NS}.hero.commissionSupport`),
      notice: t(`${NS}.commission.ledgerNote`),
    },
    timelineTitle: t(`${NS}.commission.timelineTitle`),
    steps: TIMELINE.map((id) => ({
      id,
      label: t(`${NS}.commission.timeline.${id}.label`),
      body: t(`${NS}.commission.timeline.${id}.body`),
    })),
    rules: [
      {
        id: "monthly",
        title: t(`${GUIDE}.topics.monthly.title`),
        body: t(`${GUIDE}.topics.monthly.body`),
      },
      {
        id: "yearly",
        title: t(`${NS}.commission.rules.yearlyTitle`),
        body: t(`${NS}.commission.rules.yearlyBody`),
      },
      {
        id: "oneTime",
        title: t(`${NS}.commission.rules.oneTimeTitle`),
        body: t(`${NS}.commission.rules.oneTimeBody`),
      },
      ...COMMISSION_GUIDE_TOPICS.filter((id) => id !== "monthly").map((id) => ({
        id,
        title: t(`${GUIDE}.topics.${id}.title`),
        body: t(`${GUIDE}.topics.${id}.body`),
      })),
    ],
    notes: [
      t(`${NS}.commission.intervalGap`),
      t(`${GUIDE}.percentNotLive`),
      t(`${NS}.commission.unavailableNote`),
    ],
  };
}

export function buildSectionHero(t: Translator, key: "links" | "leads" | "customers" | "sales"): SalesHeroModel {
  return {
    title: t(`${NS}.hero.${key}Title`),
    support: t(`${NS}.hero.${key}Support`),
  };
}

export function buildEmptyModel(
  t: Translator,
  key: "sales" | "leads" | "customers",
  href: string,
): EmptyStateModel {
  return {
    title: t(`${NS}.empty.${key}Title`),
    body: t(`${NS}.empty.${key}Body`),
    action: { href, label: t(`${NS}.empty.${key}Action`) },
  };
}
