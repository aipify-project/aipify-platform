import type { Translator } from "@/lib/i18n/translate";
import {
  EXECUTION_OUTCOMES,
  PLAYBOOK_CATEGORIES,
  PLAYBOOK_STATUSES,
  STEP_ACTION_TYPES,
  TRIGGER_TYPES,
} from "./constants";
import type { PlatformPlaybookCenterLabels } from "./types";

export function buildPlatformPlaybookCenterLabels(t: Translator): PlatformPlaybookCenterLabels {
  const p = "platform.playbookCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      playbooks: t(`${p}.sections.playbooks`),
      templates: t(`${p}.sections.templates`),
      executions: t(`${p}.sections.executions`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
      steps: t(`${p}.sections.steps`),
      conditions: t(`${p}.sections.conditions`),
      createPlaybook: t(`${p}.sections.createPlaybook`),
    },
    overview: {
      activePlaybooks: t(`${p}.overview.activePlaybooks`),
      automationsRunning: t(`${p}.overview.automationsRunning`),
      failedExecutions: t(`${p}.overview.failedExecutions`),
      manualInterventions: t(`${p}.overview.manualInterventions`),
      scheduledWorkflows: t(`${p}.overview.scheduledWorkflows`),
      mostUsedPlaybooks: t(`${p}.overview.mostUsedPlaybooks`),
    },
    table: {
      name: t(`${p}.table.name`),
      category: t(`${p}.table.category`),
      description: t(`${p}.table.description`),
      owner: t(`${p}.table.owner`),
      triggerType: t(`${p}.table.triggerType`),
      status: t(`${p}.table.status`),
      lastExecuted: t(`${p}.table.lastExecuted`),
      playbookName: t(`${p}.table.playbookName`),
      triggerEvent: t(`${p}.table.triggerEvent`),
      executionDate: t(`${p}.table.executionDate`),
      outcome: t(`${p}.table.outcome`),
      duration: t(`${p}.table.duration`),
      actions: t(`${p}.table.actions`),
      requiresApproval: t(`${p}.table.requiresApproval`),
    },
    categories: Object.fromEntries(
      PLAYBOOK_CATEGORIES.map((key) => [key, t(`${p}.categories.${key}`)])
    ) as PlatformPlaybookCenterLabels["categories"],
    triggerTypes: Object.fromEntries(
      TRIGGER_TYPES.map((key) => [key, t(`${p}.triggerTypes.${key}`)])
    ) as PlatformPlaybookCenterLabels["triggerTypes"],
    statuses: Object.fromEntries(
      PLAYBOOK_STATUSES.map((key) => [key, t(`${p}.statuses.${key}`)])
    ) as PlatformPlaybookCenterLabels["statuses"],
    stepActions: Object.fromEntries(
      STEP_ACTION_TYPES.map((key) => [key, t(`${p}.stepActions.${key}`)])
    ) as PlatformPlaybookCenterLabels["stepActions"],
    outcomes: Object.fromEntries(
      EXECUTION_OUTCOMES.map((key) => [key, t(`${p}.outcomes.${key}`)])
    ) as PlatformPlaybookCenterLabels["outcomes"],
    filters: {
      category: t(`${p}.filters.category`),
      status: t(`${p}.filters.status`),
      triggerType: t(`${p}.filters.triggerType`),
      owner: t(`${p}.filters.owner`),
      outcome: t(`${p}.filters.outcome`),
      allCategories: t(`${p}.filters.allCategories`),
      allStatuses: t(`${p}.filters.allStatuses`),
      allTriggerTypes: t(`${p}.filters.allTriggerTypes`),
      allOutcomes: t(`${p}.filters.allOutcomes`),
      apply: t(`${p}.filters.apply`),
    },
    actions: {
      activate: t(`${p}.actions.activate`),
      pause: t(`${p}.actions.pause`),
      archive: t(`${p}.actions.archive`),
      execute: t(`${p}.actions.execute`),
      retry: t(`${p}.actions.retry`),
      escalate: t(`${p}.actions.escalate`),
      disable: t(`${p}.actions.disable`),
      grantApproval: t(`${p}.actions.grantApproval`),
      rejectApproval: t(`${p}.actions.rejectApproval`),
      useTemplate: t(`${p}.actions.useTemplate`),
      applying: t(`${p}.actions.applying`),
    },
    create: {
      name: t(`${p}.create.name`),
      owner: t(`${p}.create.owner`),
      description: t(`${p}.create.description`),
      submit: t(`${p}.create.submit`),
      placeholderName: t(`${p}.create.placeholderName`),
      placeholderOwner: t(`${p}.create.placeholderOwner`),
      placeholderDescription: t(`${p}.create.placeholderDescription`),
    },
  };
}
