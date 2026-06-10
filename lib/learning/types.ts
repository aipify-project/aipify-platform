import type { ConfidenceLevel } from "./confidence";
import type { LearningMode } from "./modes";

export type LearningMemoryEntry = {
  id: string;
  pattern_type: string;
  source_type: string;
  approval_source: string | null;
  confidence_level: ConfidenceLevel;
  confidence_score: number;
  skill_key: string | null;
  explanation: string;
  status: string;
  learned_at: string;
  reviewed_at: string | null;
};

export type LearningCenterBundle = {
  has_customer: boolean;
  learning_mode?: LearningMode;
  adaptive_consent?: boolean;
  adaptive_allowed?: boolean;
  principle?: string;
  recent_learnings?: LearningMemoryEntry[];
  suggested_improvements?: Array<{
    id: string;
    title: string;
    description: string;
    confidence_level: ConfidenceLevel;
    confidence_score: number;
  }>;
  approval_history?: Array<{
    id: string;
    action_type: string;
    created_at: string;
  }>;
  governance?: {
    rollout_stage: string;
    environment_type: string;
  };
};
