export type CollaborationMeeting = {
  id?: string;
  meeting_title?: string;
  meeting_type?: string;
  organizer_user_id?: string;
  scheduled_at?: string;
  status?: string;
  agenda?: Record<string, unknown> | unknown[];
  summary_metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type MeetingActionItem = {
  id?: string;
  meeting_id?: string;
  assigned_user_id?: string;
  action_description?: string;
  due_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type MeetingDecision = {
  id?: string;
  meeting_id?: string;
  decision_text?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type MeetingCollaborationIntelligenceEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  scheduled_meetings?: number;
  open_actions?: number;
  completed_meetings_30d?: number;
  [key: string]: unknown;
};

export type MeetingCollaborationIntelligenceEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  meetings?: CollaborationMeeting[];
  action_items?: MeetingActionItem[];
  decisions?: MeetingDecision[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  workflow_examples?: Record<string, unknown>;
  [key: string]: unknown;
};

export type MeetingCollaborationExport = {
  has_organization?: boolean;
  exported_at?: string;
  meetings?: CollaborationMeeting[];
  action_items?: MeetingActionItem[];
  decisions?: MeetingDecision[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
