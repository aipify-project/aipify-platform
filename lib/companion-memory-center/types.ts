import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type MemoryCenterSectionKey =
  | "personal_reminders"
  | "business_reminders"
  | "follow_ups"
  | "scheduled_actions"
  | "archived";

export type MemoryCategoryKey =
  | "personal"
  | "business"
  | "customer"
  | "finance"
  | "projects"
  | "legal"
  | "operations";

export type MemoryItemType = "commitment" | "personal_memory" | "follow_up" | "scheduled_action";

export type MemoryCenterItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  owner: string;
  statusKey: OperationsStatusKey;
  sectionKey: MemoryCenterSectionKey;
  memoryCategory?: MemoryCategoryKey | string;
  createdAt?: string;
  lastActivityAt?: string;
  suggestedAction?: string;
  dueAt?: string | null;
  itemType: MemoryItemType;
  reminderDate?: string | null;
  followUpId?: string;
};

export type FollowUpSuggestion = {
  statusKey: OperationsStatusKey;
  title: string;
  summary: string;
  suggestedAction: string;
  companionPrompt?: string;
};

export type ExecutiveFollowUpDashboard = {
  overdueCommitments: number;
  openFollowUps: number;
  missedActions: number;
  outstandingApprovals: number;
  items: Array<Record<string, unknown>>;
};

export type CompanionMemoryCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  privacyNote?: string;
  sections: {
    personalReminders: MemoryCenterItem[];
    businessReminders: MemoryCenterItem[];
    followUps: MemoryCenterItem[];
    scheduledActions: MemoryCenterItem[];
    archivedMemories: MemoryCenterItem[];
  };
  followUpSuggestions: FollowUpSuggestion[];
  executiveDashboard: ExecutiveFollowUpDashboard;
  statistics: {
    personalCount: number;
    businessCount: number;
    followUpCount: number;
    scheduledCount: number;
    archivedCount: number;
  };
  error?: string;
};

export type CommitmentDetectionResult = {
  detected: boolean;
  confidence?: string;
  memoryCategory?: MemoryCategoryKey | string;
  sectionKey?: MemoryCenterSectionKey | string;
  title?: string;
  summary?: string;
  suggestedAction?: string;
  requiresConfirmation?: boolean;
  privacyNote?: string;
  reason?: string;
};
