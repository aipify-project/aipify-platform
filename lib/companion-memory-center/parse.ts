import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  CommitmentDetectionResult,
  CompanionMemoryCenter,
  ExecutiveFollowUpDashboard,
  FollowUpSuggestion,
  MemoryCenterItem,
  MemoryCenterSectionKey,
  MemoryItemType,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const map: Record<string, OperationsStatusKey> = {
    completed: "completed",
    requires_attention: "requires_attention",
    waiting: "waiting",
    information: "information",
    archived: "completed",
    snoozed: "waiting",
    not_allowed: "not_allowed",
    restricted: "restricted",
    verified: "verified",
  };
  return map[key] ?? "information";
}

function parseItem(raw: unknown): MemoryCenterItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary ?? d.description),
    source: asString(d.source ?? d.source_type),
    owner: asString(d.owner ?? d.owner_label, "You"),
    statusKey: asStatus(d.status_key ?? d.statusKey ?? d.status),
    sectionKey: asString(d.section_key ?? d.sectionKey, "personal_reminders") as MemoryCenterSectionKey,
    memoryCategory: asString(d.memory_category ?? d.category) || undefined,
    createdAt: asString(d.created_at ?? d.createdAt) || undefined,
    lastActivityAt: asString(d.last_activity_at ?? d.lastActivityAt ?? d.updated_at) || undefined,
    suggestedAction: asString(d.suggested_action ?? d.recommended_action) || undefined,
    dueAt: asString(d.due_at ?? d.due_date) || null,
    itemType: asString(d.item_type, "commitment") as MemoryItemType,
    reminderDate: asString(d.reminder_date) || null,
    followUpId: asString(d.follow_up_id) || undefined,
  };
}

function parseItems(raw: unknown): MemoryCenterItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseItem);
}

function parseSuggestion(raw: unknown): FollowUpSuggestion {
  const d = asRecord(raw);
  return {
    statusKey: asStatus(d.status_key),
    title: asString(d.title),
    summary: asString(d.summary),
    suggestedAction: asString(d.suggested_action),
    companionPrompt: asString(d.companion_prompt) || undefined,
  };
}

function parseExecutive(raw: unknown): ExecutiveFollowUpDashboard {
  const d = asRecord(raw);
  return {
    overdueCommitments: asNumber(d.overdue_commitments),
    openFollowUps: asNumber(d.open_follow_ups),
    missedActions: asNumber(d.missed_actions),
    outstandingApprovals: asNumber(d.outstanding_approvals),
    items: Array.isArray(d.items) ? (d.items as Array<Record<string, unknown>>) : [],
  };
}

export function parseCompanionMemoryCenter(raw: unknown): CompanionMemoryCenter {
  const d = asRecord(raw);
  if (!d.found) {
    return {
      found: false,
      sections: {
        personalReminders: [],
        businessReminders: [],
        followUps: [],
        scheduledActions: [],
        archivedMemories: [],
      },
      followUpSuggestions: [],
      executiveDashboard: {
        overdueCommitments: 0,
        openFollowUps: 0,
        missedActions: 0,
        outstandingApprovals: 0,
        items: [],
      },
      statistics: {
        personalCount: 0,
        businessCount: 0,
        followUpCount: 0,
        scheduledCount: 0,
        archivedCount: 0,
      },
      error: asString(d.error) || undefined,
    };
  }

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    privacyNote: asString(d.privacy_note) || undefined,
    sections: {
      personalReminders: parseItems(sections.personal_reminders),
      businessReminders: parseItems(sections.business_reminders),
      followUps: parseItems(sections.follow_ups),
      scheduledActions: parseItems(sections.scheduled_actions),
      archivedMemories: parseItems(sections.archived_memories),
    },
    followUpSuggestions: Array.isArray(d.follow_up_suggestions)
      ? d.follow_up_suggestions.map(parseSuggestion)
      : [],
    executiveDashboard: parseExecutive(d.executive_dashboard),
    statistics: {
      personalCount: asNumber(stats.personal_count),
      businessCount: asNumber(stats.business_count),
      followUpCount: asNumber(stats.follow_up_count),
      scheduledCount: asNumber(stats.scheduled_count),
      archivedCount: asNumber(stats.archived_count),
    },
  };
}

export function parseCommitmentDetection(raw: unknown): CommitmentDetectionResult {
  const d = asRecord(raw);
  return {
    detected: d.detected === true,
    confidence: asString(d.confidence) || undefined,
    memoryCategory: asString(d.memory_category) || undefined,
    sectionKey: asString(d.section_key) || undefined,
    title: asString(d.title) || undefined,
    summary: asString(d.summary) || undefined,
    suggestedAction: asString(d.suggested_action) || undefined,
    requiresConfirmation: d.requires_confirmation === true,
    privacyNote: asString(d.privacy_note) || undefined,
    reason: asString(d.reason) || undefined,
  };
}

export function parseMemoryCenterAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return {
    ok: d.ok === true,
    error: asString(d.error) || undefined,
  };
}
