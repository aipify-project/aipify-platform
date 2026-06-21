import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import { parseHomepageRedesign, type CommandBriefDemoLabels, type HomepageRedesignContent } from "@/lib/marketing/parse-homepage";

export type ProductWorkflowStep = {
  title: string;
  detail: string;
  prepared?: string;
  approval?: string;
  audit?: string;
};

export type ProductWorkflowExample = {
  id: string;
  label: string;
  disclaimer: string;
  steps: ProductWorkflowStep[];
};

export type ProductEngine = {
  id: string;
  name: string;
  purpose: string;
  signal: string;
  action: string;
  surface: string;
  primary?: boolean;
  detail?: {
    signal: string;
    context: string;
    recommendation: string;
    approvalRule: string;
    briefItem: string;
    auditEvent: string;
  };
};

export type ProductPackCard = {
  id: string;
  name: string;
  audience: string;
  challenge: string;
  capabilities: string[];
  briefSignal: string;
  cta: string;
  href: string;
};

export type ProductPageContent = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    explorePacks: string;
  };
  commandBriefHero: HomepageRedesignContent["commandBrief"];
  commandBriefSection: {
    title: string;
    subtitle: string;
    points: Array<{ title: string; body: string }>;
    demo: CommandBriefDemoLabels;
  };
  workflow: {
    title: string;
    subtitle: string;
    examples: ProductWorkflowExample[];
    controls: { play: string; pause: string; previous: string; next: string };
  };
  coordination: {
    title: string;
    subtitle: string;
    peopleTitle: string;
    people: string[];
    aipifyTitle: string;
    aipifyModules: string[];
    systemsTitle: string;
    systems: string[];
  };
  companion: {
    title: string;
    subtitle: string;
    distinction: string;
    panel: {
      title: string;
      contextLabel: string;
      contextItems: string[];
      recommendationLabel: string;
      recommendation: string;
      actions: string[];
      status: string;
      explainLabel: string;
    };
    capabilities: Array<{ id: string; title: string; meaning: string; example: string; boundary: string; humanControl: string }>;
  };
  platform: {
    title: string;
    subtitle: string;
    layers: Array<{ name: string; items: string[] }>;
  };
  engines: {
    title: string;
    subtitle: string;
    secondaryTitle: string;
    items: ProductEngine[];
  };
  businessPacks: {
    title: string;
    subtitle: string;
    modelTitle: string;
    modelSteps: string[];
    modelNote: string;
    packs: ProductPackCard[];
    exploreAll: string;
  };
  governance: {
    title: string;
    subtitle: string;
    levels: Array<{ level: string; title: string; body: string; example: string; humanControl: string; audit: string; reversible: string }>;
    workflowTitle: string;
    workflowSteps: string[];
  };
  enterprise: {
    title: string;
    pillars: Array<{ title: string; benefit: string; example: string; status: "available" | "custom" | "planned" | "enterprise_only" }>;
    trust: Array<{ title: string; body: string }>;
  };
  expansion: {
    title: string;
    stages: Array<{ name: string; items: string[] }>;
  };
  finalCta: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
};

function parseStringListFromRecord(obj: Record<string, unknown> | undefined, key: string): string[] {
  const raw = obj?.[key];
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => String((raw as Record<string, string>)[k] ?? ""));
}

function parseWorkflowSteps(raw: unknown): ProductWorkflowStep[] {
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw)) return raw as ProductWorkflowStep[];
  return Object.keys(raw as Record<string, ProductWorkflowStep>)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => (raw as Record<string, ProductWorkflowStep>)[k]);
}

function parseWorkflowExamples(section: Record<string, unknown> | undefined): ProductWorkflowExample[] {
  const raw = section?.examples;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const ex = (raw as Record<string, Record<string, unknown>>)[k];
      return {
        id: String(ex.id ?? k),
        label: String(ex.label ?? ""),
        disclaimer: String(ex.disclaimer ?? ""),
        steps: parseWorkflowSteps(ex.steps),
      };
    })
    .filter((e) => e.steps.length > 0);
}

function parseEngines(section: Record<string, unknown> | undefined): ProductEngine[] {
  const raw = section?.items;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => (raw as Record<string, ProductEngine>)[k]);
}

function parseCommandBriefDemo(section: Record<string, unknown> | undefined): CommandBriefDemoLabels | null {
  if (!section) return null;
  const sinceItems = parseStringListFromRecord(section, "sinceItems");
  if (sinceItems.length === 0) return null;
  return {
    panelTitle: String(section.panelTitle ?? "Command Brief"),
    panelOrganization: String(section.panelOrganization ?? ""),
    panelContext: String(section.panelContext ?? ""),
    headerBadge: String(section.headerBadge ?? ""),
    sinceLastLogin: String(section.sinceLastLogin ?? "Since your last visit"),
    aipifyCompleted: String(section.aipifyCompleted ?? "Aipify completed"),
    needsAttention: String(section.needsAttention ?? "Needs your attention"),
    recommendedActions: String(section.recommendedActions ?? "Recommended actions"),
    organizationStatus: String(section.organizationStatus ?? "Organization status"),
    sinceItems,
    completedItems: parseStringListFromRecord(section, "completedItems"),
    attentionItems: parseStringListFromRecord(section, "attentionItems"),
    actionItems: parseStringListFromRecord(section, "actionItems"),
    statusItems: parseStringListFromRecord(section, "statusItems"),
  };
}

function parseCommandBriefPoints(section: Record<string, unknown> | undefined): Array<{ title: string; body: string }> {
  const raw = section?.points;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const p = (raw as Record<string, { title?: string; body?: string }>)[k];
      return { title: p?.title ?? "", body: p?.body ?? "" };
    });
}

function parseCompanionCapabilities(
  section: Record<string, unknown> | undefined,
): ProductPageContent["companion"]["capabilities"] {
  const raw = section?.capabilities;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const c = (raw as Record<string, Record<string, string>>)[k];
      return {
        id: String(c.id ?? k),
        title: String(c.title ?? ""),
        meaning: String(c.meaning ?? ""),
        example: String(c.example ?? ""),
        boundary: String(c.boundary ?? ""),
        humanControl: String(c.humanControl ?? ""),
      };
    });
}

function parseGovernanceLevels(section: Record<string, unknown> | undefined): ProductPageContent["governance"]["levels"] {
  const raw = section?.levels;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const l = (raw as Record<string, Record<string, string>>)[k];
      return {
        level: String(l.level ?? ""),
        title: String(l.title ?? ""),
        body: String(l.body ?? ""),
        example: String(l.example ?? ""),
        humanControl: String(l.humanControl ?? ""),
        audit: String(l.audit ?? ""),
        reversible: String(l.reversible ?? ""),
      };
    });
}

function parseEnterprisePillars(section: Record<string, unknown> | undefined): ProductPageContent["enterprise"]["pillars"] {
  const raw = section?.pillars;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const p = (raw as Record<string, Record<string, string>>)[k];
      return {
        title: String(p.title ?? ""),
        benefit: String(p.benefit ?? ""),
        example: String(p.example ?? ""),
        status: (p.status ?? "available") as ProductPageContent["enterprise"]["pillars"][number]["status"],
      };
    });
}

function parseTrustItems(section: Record<string, unknown> | undefined): Array<{ title: string; body: string }> {
  const raw = section?.trust;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const t = (raw as Record<string, { title?: string; body?: string }>)[k];
      return { title: t?.title ?? "", body: t?.body ?? "" };
    });
}

function parsePackCards(section: Record<string, unknown> | undefined): ProductPackCard[] {
  const raw = section?.packs;
  if (!raw || typeof raw !== "object") return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => {
      const p = (raw as Record<string, Record<string, unknown>>)[k];
      return {
        id: String(p.id ?? k),
        name: String(p.name ?? ""),
        audience: String(p.audience ?? ""),
        challenge: String(p.challenge ?? ""),
        capabilities: parseStringListFromRecord(p, "capabilities"),
        briefSignal: String(p.briefSignal ?? ""),
        cta: String(p.cta ?? ""),
        href: String(p.href ?? ""),
      };
    });
}

export function parseProductPageContent(marketing: MarketingDictionary): ProductPageContent {
  const hp = parseHomepageRedesign(marketing);
  const section = getSection<Record<string, unknown>>(marketing, "productPageRedesign");
  const meta = (section.meta as { title?: string; description?: string }) ?? {};
  const hero = (section.hero as ProductPageContent["hero"]) ?? {
    eyebrow: "Aipify Business Operating System",
    title: hp.hero.title,
    subtitle: hp.hero.subtitle,
    ctaPrimary: hp.hero.ctaPrimary,
    ctaSecondary: hp.hero.ctaSecondary,
    explorePacks: hp.hero.explorePacks,
  };

  const cbSection = section.commandBrief as Record<string, unknown> | undefined;
  const cbPoints = parseCommandBriefPoints(cbSection);
  const cbFromSection = cbSection as { title?: string; subtitle?: string } | undefined;
  const servicesDemo =
    parseCommandBriefDemo(section.servicesAndHospitalityDemo as Record<string, unknown> | undefined) ??
    parseCommandBriefDemo(cbSection);
  const wfSection = section.workflow as Record<string, unknown> | undefined;
  const wfControls = (wfSection?.controls as { play?: string; pause?: string; previous?: string; next?: string }) ?? {};
  const coordSection = section.coordination as Record<string, unknown> | undefined;
  const companionSection = section.companion as Record<string, unknown> | undefined;
  const govSection = section.governance as Record<string, unknown> | undefined;
  const entSection = section.enterprise as Record<string, unknown> | undefined;

  return {
    meta: {
      title: meta.title ?? "Aipify Business Operating System | Product Platform",
      description:
        meta.description ??
        "Explore how Aipify connects Command Brief, Companion, operational engines, Business Packs, governance and approved workflows in one coordinated platform.",
    },
    hero,
    commandBriefHero: hp.commandBrief,
    commandBriefSection: {
      title: cbFromSection?.title ?? "Command Brief — your organization summarized before you start.",
      subtitle:
        cbFromSection?.subtitle ??
        "Aipify brings the most important operational changes, completed work, and decisions to you — instead of making you search through disconnected systems.",
      points:
        cbPoints.length > 0
          ? cbPoints
          : [
              { title: "Since your last visit", body: "Meaningful operational changes without searching every module." },
              { title: "What Aipify helped with", body: "Drafts, summaries, preparation and approved work completed by Aipify." },
              { title: "What needs attention", body: "Decisions, approvals, risks and exceptions requiring human review." },
              { title: "What should happen next", body: "Grounded recommended actions with paths to the relevant workflow." },
            ],
      demo:
        servicesDemo ?? {
          panelTitle: hp.commandBrief.panelTitle,
          panelOrganization: "Unonight Operations",
          panelContext: "Friday morning",
          headerBadge: "All systems operational",
          sinceLastLogin: hp.commandBrief.sinceLastLogin,
          aipifyCompleted: hp.commandBrief.aipifyCompleted,
          needsAttention: hp.commandBrief.needsAttention,
          recommendedActions: hp.commandBrief.recommendedActions,
          organizationStatus: hp.commandBrief.organizationStatus,
          sinceItems: hp.commandBrief.sinceItems,
          completedItems: hp.commandBrief.completedItems,
          attentionItems: hp.commandBrief.attentionItems,
          actionItems: hp.commandBrief.actionItems,
          statusItems: hp.commandBrief.statusItems,
        },
    },
    workflow: {
      title: String((section.workflow as { title?: string })?.title ?? "See how work moves through Aipify."),
      subtitle: String((section.workflow as { subtitle?: string })?.subtitle ?? ""),
      examples: parseWorkflowExamples(wfSection),
      controls: {
        play: wfControls.play ?? "Play",
        pause: wfControls.pause ?? "Pause",
        previous: wfControls.previous ?? "Previous",
        next: wfControls.next ?? "Next",
      },
    },
    coordination: {
      title: String(coordSection?.title ?? "One coordinated layer across your existing systems."),
      subtitle: String(coordSection?.subtitle ?? ""),
      peopleTitle: String(coordSection?.peopleTitle ?? "People"),
      people: parseStringListFromRecord(coordSection, "people"),
      aipifyTitle: String(coordSection?.aipifyTitle ?? "Aipify Business Operating System"),
      aipifyModules: parseStringListFromRecord(coordSection, "aipifyModules"),
      systemsTitle: String(coordSection?.systemsTitle ?? "Existing systems"),
      systems: parseStringListFromRecord(coordSection, "systems"),
    },
    companion: {
      title: String(companionSection?.title ?? "Companion works inside the operational context."),
      subtitle: String(companionSection?.subtitle ?? ""),
      distinction: String(companionSection?.distinction ?? ""),
      panel: {
        title: String((companionSection?.panel as { title?: string })?.title ?? "Companion panel"),
        contextLabel: String((companionSection?.panel as { contextLabel?: string })?.contextLabel ?? "Context"),
        contextItems: parseStringListFromRecord(companionSection?.panel as Record<string, unknown>, "contextItems"),
        recommendationLabel: String(
          (companionSection?.panel as { recommendationLabel?: string })?.recommendationLabel ?? "Companion recommendation",
        ),
        recommendation: String((companionSection?.panel as { recommendation?: string })?.recommendation ?? ""),
        actions: parseStringListFromRecord(companionSection?.panel as Record<string, unknown>, "actions"),
        status: String((companionSection?.panel as { status?: string })?.status ?? ""),
        explainLabel: String((companionSection?.panel as { explainLabel?: string })?.explainLabel ?? "Why this recommendation?"),
      },
      capabilities: parseCompanionCapabilities(companionSection),
    },
    platform: {
      title: String((section.platform as { title?: string })?.title ?? "One platform foundation. Modular operational capability."),
      subtitle: String((section.platform as { subtitle?: string })?.subtitle ?? ""),
      layers: Object.values((section.platform as { layers?: Record<string, { name?: string; items?: Record<string, string> }> })?.layers ?? {}).map(
        (layer) => ({
          name: layer.name ?? "",
          items: parseStringListFromRecord(layer as Record<string, unknown>, "items"),
        }),
      ),
    },
    engines: {
      title: String((section.engines as { title?: string })?.title ?? ""),
      subtitle: String((section.engines as { subtitle?: string })?.subtitle ?? ""),
      secondaryTitle: String((section.engines as { secondaryTitle?: string })?.secondaryTitle ?? "More engines"),
      items: parseEngines(section.engines as Record<string, unknown>),
    },
    businessPacks: {
      title: String((section.businessPacks as { title?: string })?.title ?? hp.businessPacks.title),
      subtitle: String((section.businessPacks as { subtitle?: string })?.subtitle ?? ""),
      modelTitle: String((section.businessPacks as { modelTitle?: string })?.modelTitle ?? "How Business Packs work"),
      modelSteps: parseStringListFromRecord(section.businessPacks as Record<string, unknown>, "modelSteps"),
      modelNote: String((section.businessPacks as { modelNote?: string })?.modelNote ?? ""),
      packs: parsePackCards(section.businessPacks as Record<string, unknown>),
      exploreAll: String((section.businessPacks as { exploreAll?: string })?.exploreAll ?? hp.businessPacks.exploreAll),
    },
    governance: {
      title: String(govSection?.title ?? "Aipify recommends. Humans decide."),
      subtitle: String(govSection?.subtitle ?? ""),
      levels: parseGovernanceLevels(govSection),
      workflowTitle: String(govSection?.workflowTitle ?? ""),
      workflowSteps: parseStringListFromRecord(govSection, "workflowSteps"),
    },
    enterprise: {
      title: String(entSection?.title ?? "Built for professional and enterprise organizations."),
      pillars: parseEnterprisePillars(entSection),
      trust: parseTrustItems(entSection),
    },
    expansion: {
      title: String((section.expansion as { title?: string })?.title ?? ""),
      stages: Object.values((section.expansion as { stages?: Record<string, { name?: string; items?: Record<string, string> }> })?.stages ?? {}).map(
        (s) => ({
          name: s.name ?? "",
          items: parseStringListFromRecord(s as Record<string, unknown>, "items"),
        }),
      ),
    },
    finalCta: (section.finalCta as ProductPageContent["finalCta"]) ?? {
      title: "See how Aipify could work inside your organization.",
      subtitle: "",
      primary: "Book a Demo",
      secondary: "Explore Business Packs",
      tertiary: "Request Early Access",
    },
  };
}
