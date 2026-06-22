import type { Translator } from "@/lib/i18n/translate";
import { APP_PORTAL_NAV_GROUPS } from "./nav-config";
import type { AppPortalLabels } from "./types";

export function buildAppPortalLabels(t: Translator): AppPortalLabels {
  const d = "customerApp.portalStructure.dashboard";
  const f = "customerApp.portalStructure.foundation";
  const l = "customerApp.portalStructure.license";
  const k = "customerApp.portalStructure.knowledge";
  const s = "customerApp.portalStructure.sinceLastLoginPage";

  return {
    dashboard: {
      title: t(`${d}.title`),
      subtitle: t(`${d}.subtitle`),
      loading: t(`${d}.loading`),
      principle: t(`${d}.principle`),
      privacyNote: t(`${d}.privacyNote`),
      organizationOverview: t(`${d}.organizationOverview`),
      teamActivity: t(`${d}.teamActivity`),
      subscriptionStatus: t(`${d}.subscriptionStatus`),
      businessPackStatus: t(`${d}.businessPackStatus`),
      tasksAttention: t(`${d}.tasksAttention`),
      recommendedActions: t(`${d}.recommendedActions`),
      notifications: t(`${d}.notifications`),
      sinceLastLogin: t(`${d}.sinceLastLogin`),
      importantUpdates: t(`${d}.importantUpdates`),
      completedActions: t(`${d}.completedActions`),
      newNotifications: t(`${d}.newNotifications`),
      businessPackHighlights: t(`${d}.businessPackHighlights`),
      noBusinessPacks: t(`${d}.noBusinessPacks`),
      openModule: t(`${d}.openModule`),
      portalModules: t(`${d}.portalModules`),
      activeMembers: t(`${d}.activeMembers`),
      plan: t(`${d}.plan`),
      status: t(`${d}.status`),
    },
    foundation: {
      back: t(`${f}.back`),
      structureNote: t(`${f}.structureNote`),
      comingSoon: t(`${f}.comingSoon`),
    },
    license: {
      upgradeTitle: t(`${l}.upgradeTitle`),
      upgradeBody: t(`${l}.upgradeBody`),
      upgradeCta: t(`${l}.upgradeCta`),
      unavailableTitle: t(`${l}.unavailableTitle`),
      pageLoadError: t(`${l}.pageLoadError`),
    },
    knowledge: {
      title: t(`${k}.title`),
      subtitle: t(`${k}.subtitle`),
    },
    sinceLastLoginPage: {
      title: t(`${s}.title`),
      subtitle: t(`${s}.subtitle`),
    },
  };
}

export function buildAppPortalNavLabels(t: Translator): Record<string, string> {
  const entries: Array<[string, string]> = [];
  for (const group of APP_PORTAL_NAV_GROUPS) {
    entries.push([group.id, t(group.labelKey)]);
    for (const item of group.items) {
      entries.push([item.id, t(item.labelKey)]);
    }
  }
  return Object.fromEntries(entries);
}

export function buildAppPortalFaqAnswerLabels(t: Translator): Record<string, string> {
  const slugs = [
    "what-is-aipify",
    "invite-team-members",
    "change-subscriptions",
    "upgrade-plan",
    "what-are-business-packs",
    "view-invoices",
    "contact-support",
    "role-management",
    "since-last-login",
    "feature-access",
    "upgrade-permissions",
    "notification-preferences",
  ] as const;

  return Object.fromEntries(
    slugs.map((slug) => [`customerApp.portalStructure.faqAnswers.${slug}`, t(`customerApp.portalStructure.faqAnswers.${slug}`)])
  );
}
