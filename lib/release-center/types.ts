import type {
  ApprovalRole,
  Audience,
  CalendarEventType,
  ChangeLogCategory,
  CommunicationChannel,
  ReleaseStatus,
  ReleaseType,
  RiskLevel,
} from "./constants";

export type ReleaseCenterFilters = {
  release_type?: ReleaseType | "";
  status?: ReleaseStatus | "";
  owner?: string;
  audience?: Audience | "";
  date_from?: string;
  date_to?: string;
};

export type ReleaseOverview = {
  upcoming_releases: number;
  releases_in_testing: number;
  production_releases: number;
  emergency_hotfixes: number;
  notifications_pending: number;
  recently_completed: number;
};

export type ChangeLogEntry = {
  id: string;
  release_id: string;
  release_name?: string;
  version: string;
  category: ChangeLogCategory;
  summary: string;
  release_date: string | null;
  status: ReleaseStatus;
  audience: Audience;
};

export type ReleaseApproval = {
  id: string;
  approval_role: ApprovalRole;
  approver: string;
  status: string;
  notes: string;
  decided_at: string | null;
};

export type ReleaseCommunication = {
  id: string;
  channel: CommunicationChannel;
  audience: Audience;
  status: string;
  published_at: string | null;
};

export type ReleaseRollback = {
  id: string;
  rollback_reason: string;
  impact_assessment: string;
  resolution_notes: string;
  recovery_actions: string;
  created_at: string;
};

export type ReleaseRecord = {
  id: string;
  release_name: string;
  release_version: string;
  release_type: ReleaseType;
  description: string;
  planned_date: string | null;
  actual_date: string | null;
  owner: string;
  risk_level: RiskLevel;
  status: ReleaseStatus;
  audience: Audience;
  target_plans: string[];
  requires_approval: boolean;
  approval_status: string;
  notifications_pending: boolean;
  change_log: ChangeLogEntry[];
  approvals: ReleaseApproval[];
  communications: ReleaseCommunication[];
  rollbacks: ReleaseRollback[];
  created_at: string;
  updated_at: string;
};

export type CalendarEvent = {
  id: string;
  event_type: CalendarEventType;
  title: string;
  summary: string;
  starts_at: string;
  ends_at: string | null;
  release_id: string | null;
};

export type ReleaseAuditEntry = {
  id: string;
  release_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type ReleaseCenter = {
  principle: string;
  filters: ReleaseCenterFilters;
  overview: ReleaseOverview;
  releases: ReleaseRecord[];
  change_log: ChangeLogEntry[];
  calendar: CalendarEvent[];
  audit: ReleaseAuditEntry[];
};

export type ReleaseCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    releases: string;
    changeLog: string;
    calendar: string;
    audit: string;
    filters: string;
    createRelease: string;
    approvals: string;
    communications: string;
    rollbacks: string;
  };
  overview: {
    upcomingReleases: string;
    releasesInTesting: string;
    productionReleases: string;
    emergencyHotfixes: string;
    notificationsPending: string;
    recentlyCompleted: string;
  };
  table: {
    releaseName: string;
    version: string;
    category: string;
    summary: string;
    releaseDate: string;
    status: string;
    audience: string;
    owner: string;
    plannedDate: string;
    actualDate: string;
    riskLevel: string;
    type: string;
    actions: string;
  };
  releaseTypes: Record<ReleaseType, string>;
  riskLevels: Record<RiskLevel, string>;
  changeLogCategories: Record<ChangeLogCategory, string>;
  statuses: Record<ReleaseStatus, string>;
  audiences: Record<Audience, string>;
  approvalRoles: Record<ApprovalRole, string>;
  communicationChannels: Record<CommunicationChannel, string>;
  calendarEventTypes: Record<CalendarEventType, string>;
  filters: {
    releaseType: string;
    status: string;
    owner: string;
    audience: string;
    dateFrom: string;
    dateTo: string;
    allTypes: string;
    allStatuses: string;
    allAudiences: string;
    apply: string;
  };
  actions: {
    create: string;
    approve: string;
    revokeApproval: string;
    publish: string;
    rollback: string;
    advanceStatus: string;
    applying: string;
  };
  create: {
    releaseName: string;
    releaseVersion: string;
    description: string;
    submit: string;
    placeholderName: string;
    placeholderVersion: string;
    placeholderDescription: string;
  };
};
