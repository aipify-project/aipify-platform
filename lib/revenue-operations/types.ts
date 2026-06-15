export type RevenueOperationsOverview = {
  active_billing_providers: number;
  successful_activations_30d: number;
  pending_activations: number;
  failed_activations: number;
  subscription_upgrades: number;
  subscription_downgrades: number;
};

export type FailedActivation = {
  id: string;
  customer_id: string;
  customer: string;
  provider: string;
  failure_reason: string;
  detected_at: string;
  resolution_status: string;
  package_key: string;
};

export type RevenueTimelineEvent = {
  id: string;
  customer_id: string | null;
  customer: string;
  event_type: string;
  provider: string;
  timestamp: string;
  outcome: string;
  summary: string;
};

export type RevenueNotification = {
  id: string;
  customer_id: string;
  customer: string;
  notification_type: string;
  channel: string;
  status: string;
  summary: string;
  created_at: string;
};

export type RevenueAuditEntry = {
  id: string;
  customer_id: string | null;
  activation_id: string | null;
  action: string;
  summary: string;
  context: Record<string, unknown>;
  created_at: string;
};

export type RevenueOperationsCenter = {
  principle: string;
  founding_principle: string;
  external_responsibilities: {
    tax_calculation: boolean;
    vat_reporting: boolean;
    note: string;
  };
  activation_flow: string[];
  package_sync: {
    on_payment_success: string;
    on_subscription_expiry: string;
    status: string;
  };
  overview: RevenueOperationsOverview;
  failed_activations: FailedActivation[];
  timeline: RevenueTimelineEvent[];
  notifications: RevenueNotification[];
  audit: RevenueAuditEntry[];
  supported_providers: string[];
  supported_event_types: string[];
};

export type RevenueOperationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  foundingPrinciple: string;
  sections: {
    overview: string;
    failedActivations: string;
    timeline: string;
    trialConversion: string;
    packageSync: string;
    notifications: string;
    audit: string;
    externalResponsibilities: string;
  };
  overview: {
    activeProviders: string;
    successfulActivations: string;
    pendingActivations: string;
    failedActivations: string;
    upgrades: string;
    downgrades: string;
  };
  table: {
    customer: string;
    provider: string;
    failureReason: string;
    detectedAt: string;
    resolutionStatus: string;
    eventType: string;
    timestamp: string;
    outcome: string;
    summary: string;
    notificationType: string;
    channel: string;
    status: string;
    action: string;
  };
  trialConversion: {
    title: string;
    steps: string;
  };
  packageSync: {
    onSuccess: string;
    onExpiry: string;
    status: string;
  };
  external: {
    title: string;
    note: string;
  };
  actions: {
    retry: string;
    escalate: string;
    contact: string;
    reviewLogs: string;
    applying: string;
  };
  resolutions: Record<string, string>;
  outcomes: Record<string, string>;
  eventTypes: Record<string, string>;
  notificationTypes: Record<string, string>;
  auditActions: Record<string, string>;
  providers: Record<string, string>;
  empty: {
    failed: string;
    timeline: string;
    notifications: string;
    audit: string;
  };
};
