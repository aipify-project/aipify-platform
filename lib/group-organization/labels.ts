import type { Translator } from "@/lib/i18n/translate";
import type { GroupOrganizationLabels } from "./types";
import { ENTITY_TYPES, SHARED_SIGNAL_TYPES } from "./constants";

export function buildGroupOrganizationLabels(t: Translator): GroupOrganizationLabels {
  const p = "superAdmin.groupOverview";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    foundationStatement: t(`${p}.foundationStatement`),
    tagline: t(`${p}.tagline`),
    sections: {
      summary: t(`${p}.sections.summary`),
      entities: t(`${p}.sections.entities`),
      investments: t(`${p}.sections.investments`),
      sharedIntelligence: t(`${p}.sections.sharedIntelligence`),
      audit: t(`${p}.sections.audit`),
      hierarchy: t(`${p}.sections.hierarchy`),
    },
    summary: {
      totalEntities: t(`${p}.summary.totalEntities`),
      activeEntities: t(`${p}.summary.activeEntities`),
      activeUsers: t(`${p}.summary.activeUsers`),
      activeSubscriptions: t(`${p}.summary.activeSubscriptions`),
      investments: t(`${p}.summary.investments`),
      signals: t(`${p}.summary.signals`),
    },
    entities: {
      name: t(`${p}.entities.name`),
      type: t(`${p}.entities.type`),
      status: t(`${p}.entities.status`),
      domain: t(`${p}.entities.domain`),
      users: t(`${p}.entities.users`),
      subscriptions: t(`${p}.entities.subscriptions`),
      departments: t(`${p}.entities.departments`),
      teams: t(`${p}.entities.teams`),
      empty: t(`${p}.entities.empty`),
      archive: t(`${p}.entities.archive`),
    },
    investments: {
      company: t(`${p}.investments.company`),
      ownership: t(`${p}.investments.ownership`),
      amount: t(`${p}.investments.amount`),
      status: t(`${p}.investments.status`),
      empty: t(`${p}.investments.empty`),
    },
    intelligence: {
      type: t(`${p}.intelligence.type`),
      confidence: t(`${p}.intelligence.confidence`),
      empty: t(`${p}.intelligence.empty`),
    },
    audit: {
      empty: t(`${p}.audit.empty`),
    },
    entityTypes: Object.fromEntries(
      ENTITY_TYPES.map((type) => [type, t(`${p}.entityTypes.${type}`)])
    ),
    statuses: {
      active: t(`${p}.statuses.active`),
      archived: t(`${p}.statuses.archived`),
      pending_setup: t(`${p}.statuses.pendingSetup`),
    },
    signalTypes: Object.fromEntries(
      SHARED_SIGNAL_TYPES.map((type) => [type, t(`${p}.signalTypes.${type}`)])
    ),
  };
}
