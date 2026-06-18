import type { OperationsStatusKey } from "./status-standard";

export type OperationsCenterItem = {
  id: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  sourceModule?: string;
  routePath?: string;
  updatedAt?: string;
  kind?: string;
  alertType?: string;
  packKey?: string;
};

export type SinceLastLoginGroup = {
  id: string;
  category: string;
  title: string;
  summary: string;
  occurredAt: string;
};

export type OperationsTask = OperationsCenterItem & {
  taskScope?: "my" | "team" | "automation";
};

export type OperationsAlert = OperationsCenterItem & {
  alertType: string;
  createdAt?: string;
};

export type OperationsRecommendation = {
  id: string;
  category: string;
  title: string;
  why: string;
  expectedBenefit?: string | null;
  confidenceLevel: string;
  riskLevel: string;
  status: string;
  createdAt?: string;
};

export type OperationsTimelineEntry = {
  id: string;
  actorType: string;
  actorLabel: string;
  actionLabel: string;
  systemLabel: string;
  resultLabel: string;
  sourceModule: string;
  businessPackKey?: string | null;
  occurredAt: string;
};

export type BusinessPackEvent = {
  id: string;
  packKey: string;
  statusKey: OperationsStatusKey;
  title: string;
  summary: string;
  routePath: string;
  createdAt?: string;
};

export type AipifyOperationsCenter = {
  hasCustomer: boolean;
  philosophy?: string;
  humanOversightRequired?: boolean;
  lastLoginAt?: string | null;
  periodStart?: string | null;
  sections: {
    completed: OperationsCenterItem[];
    requiresAttention: OperationsCenterItem[];
    waiting: OperationsCenterItem[];
    information: OperationsCenterItem[];
  };
  sinceLastLogin: {
    periodStart?: string | null;
    groups: {
      today: SinceLastLoginGroup[];
      yesterday: SinceLastLoginGroup[];
      thisWeek: SinceLastLoginGroup[];
    };
    activityCounts: {
      activities: number;
      alerts: number;
      recommendations: number;
      supportSignals: number;
    };
  };
  executiveSummary: {
    headline: string;
    bullets: string[];
    revenueTrend?: string;
  };
  tasks: {
    myTasks: OperationsTask[];
    teamTasks: OperationsTask[];
    automationTasks: OperationsTask[];
  };
  alerts: OperationsAlert[];
  recommendations: OperationsRecommendation[];
  timeline: OperationsTimelineEntry[];
  businessPackEvents: BusinessPackEvent[];
  statistics: {
    requiresAttention: number;
    waiting: number;
    completed: number;
    openRecommendations: number;
  };
  privacyNote?: string;
  error?: string;
};
