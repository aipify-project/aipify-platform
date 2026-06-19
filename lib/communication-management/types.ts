export type CommMessageStatus =
  | "pending"
  | "information"
  | "attention_required"
  | "completed"
  | "requires_approval"
  | "expired";

export type CommPriority = "normal" | "important" | "critical" | "emergency";

export type CommMessage = {
  id: string;
  message_type: string;
  status: CommMessageStatus;
  priority: CommPriority;
  subject: string;
  body: string;
  sender_user_id: string | null;
  recipient_user_id: string | null;
  read_at: string | null;
  created_at: string;
};

export type CommAnnouncement = {
  id: string;
  title: string;
  body: string;
  scope: string;
  created_at: string;
};

export type CommNotification = {
  id: string;
  notification_type: string;
  priority: string;
  status: string;
  summary: string;
  source?: string;
  read_at: string | null;
  created_at: string;
};

export type CommApproval = {
  approval_id: string;
  approval_type: string;
  title: string;
  approval_status: string;
  created_at: string;
};

export type CommActivity = {
  id: string;
  activity_type: string;
  summary: string;
  created_at: string;
  actor_user_id?: string | null;
  business_pack_key?: string | null;
};

export type CommunicationManagementCenter = {
  found: boolean;
  principle?: string;
  overview?: {
    unread_messages: number;
    unread_notifications: number;
    pending_approvals: number;
    announcements: number;
  };
  inbox?: CommMessage[];
  direct_messages?: CommMessage[];
  announcements?: CommAnnouncement[];
  notifications_preview?: CommNotification[];
  approvals_preview?: CommApproval[];
  activity_preview?: CommActivity[];
  department_feeds?: { department_id: string; department_name: string; message_count: number }[];
  routes?: { notifications: string; approvals: string; activity: string };
  reports?: { unread_messages: number; notification_volume_30d: number };
};

export type NotificationManagementCenter = {
  found: boolean;
  principle?: string;
  overview?: { unread: number; critical: number; attention_required: number };
  notifications?: CommNotification[];
  communications_route?: string;
};

export type ActivityFeedCenter = {
  found: boolean;
  principle?: string;
  activity?: CommActivity[];
  recent_tasks?: { id: string; title: string; status: string; updated_at: string }[];
  recent_documents?: { id: string; title: string; status: string; updated_at: string }[];
  communications_route?: string;
};

export type UnifiedApprovalCenter = {
  found: boolean;
  principle?: string;
  pending?: CommApproval[];
  pending_count?: number;
  routes?: { trust_approvals: string; communications: string };
};
