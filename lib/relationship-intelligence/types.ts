import type { PersonType } from "./person-types";

export type RelationshipPerson = {
  id: string;
  name: string;
  relationship: string | null;
  person_type: PersonType;
  birthday: string | null;
  anniversary: string | null;
  notes: string | null;
  preferred_gifts: string[];
  favorite_activities: string[];
  communication_preferences: string | null;
  last_contact_at: string | null;
  status: string;
  timeline: TimelineEvent[];
  notes_list: ConversationNote[];
};

export type TimelineEvent = {
  id: string;
  event_type: string;
  title: string;
  description: string;
  event_date: string | null;
};

export type ConversationNote = {
  id: string;
  topic: string;
  tags: string[];
  created_at: string;
};

export type RelationshipSettings = {
  rsi_enabled: boolean;
  ask_before_remembering: boolean;
  gift_suggestions_enabled: boolean;
  follow_up_enabled: boolean;
  shared_memory_prepared: boolean;
};

export type RelationshipCenterBundle = {
  has_customer: boolean;
  settings?: RelationshipSettings;
  ethical_boundaries?: string[];
  privacy_note?: string;
  people?: RelationshipPerson[];
  upcoming_milestones?: Array<{
    id: string;
    name: string;
    type: string;
    date: string;
    message: string;
  }>;
  social_reminders?: Array<{ id: string; message: string }>;
  pending_follow_ups?: Array<{ id: string; title: string; message: string }>;
  gift_opportunities?: Array<{
    person_id: string;
    name: string;
    message: string;
    preferred_gifts: string[];
    favorite_activities: string[];
  }>;
  suggested_actions?: Array<{ id: string; message: string }>;
  proactive_assistance?: Array<{ id: string; message: string }>;
  shared_commitments?: Array<{ id: string; title: string; memory_date: string | null }>;
  shared_memory_architecture?: {
    prepared: boolean;
    status: string;
    message: string;
    future_types: string[];
  };
};
