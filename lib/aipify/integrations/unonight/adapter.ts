import type { PilotProvisionConfig } from "@/lib/aipify/pilot/types";

/** Maps Unonight platform concepts to Aipify workflow keys. */
export const UNONIGHT_WORKFLOW_MAP = {
  account_verification_queue: "unonight.account_verification",
  support_conversation: "unonight.support_case",
  marketplace_listing: "unonight.marketplace_listing_review",
  digital_product_pending: "unonight.digital_product_approval",
  image_moderation_queue: "unonight.image_moderation",
  admin_task: "unonight.admin_task_followup",
  gift_reminder: "unonight.gift_wishlist_support",
  birthday_reminder: "unonight.gift_wishlist_support",
  member_upgrade: "unonight.member_upgrade_support",
} as const;

export type UnonightSignalType = keyof typeof UNONIGHT_WORKFLOW_MAP;

export type UnonightDiscoveryFinding = {
  signal: UnonightSignalType;
  workflow_key: string;
  queue_label: string;
  estimated_volume: "low" | "medium" | "high";
  read_only: boolean;
};

export type UnonightWorkflowEventInput = {
  workflow_key: string;
  event_type: "created" | "assigned" | "replied" | "escalated" | "delayed" | "completed";
  title: string;
  description?: string;
  source_id?: string;
  severity?: string;
  metadata?: Record<string, unknown>;
};

/** Risk classification for Unonight pilot — used by governance suggestions. */
export const UNONIGHT_RISK_ACTIONS = {
  low: [
    "answer_from_faq",
    "create_support_draft",
    "create_internal_admin_task",
    "summarize_support_case",
    "tag_support_conversation",
    "notify_admin",
    "create_knowledge_gap",
    "record_workflow_event",
  ],
  medium: [
    "send_approved_support_reply",
    "assign_moderation_case",
    "update_support_status",
    "create_member_reminder",
    "draft_marketplace_guidance",
  ],
  high: [
    "approve_digital_product",
    "approve_image_content",
    "change_membership_status",
    "contact_member_external",
    "modify_marketplace_listing",
    "disable_user_feature",
    "change_shop_order_status",
  ],
  blocked: [
    "delete_user",
    "ban_user_auto",
    "issue_refund",
    "process_payment",
    "approve_adult_content_auto",
    "modify_legal_terms",
    "send_legal_notice",
    "change_billing_unverified",
  ],
} as const;

export function generateUnonightDiscoveryFindings(): {
  findings: Record<string, unknown>;
  recommendations: Record<string, unknown>;
} {
  const queues: UnonightDiscoveryFinding[] = [
    {
      signal: "account_verification_queue",
      workflow_key: UNONIGHT_WORKFLOW_MAP.account_verification_queue,
      queue_label: "Account verification queue",
      estimated_volume: "medium",
      read_only: true,
    },
    {
      signal: "support_conversation",
      workflow_key: UNONIGHT_WORKFLOW_MAP.support_conversation,
      queue_label: "Support conversations",
      estimated_volume: "high",
      read_only: true,
    },
    {
      signal: "image_moderation_queue",
      workflow_key: UNONIGHT_WORKFLOW_MAP.image_moderation_queue,
      queue_label: "Image moderation queue",
      estimated_volume: "medium",
      read_only: true,
    },
    {
      signal: "digital_product_pending",
      workflow_key: UNONIGHT_WORKFLOW_MAP.digital_product_pending,
      queue_label: "Digital product approval queue",
      estimated_volume: "low",
      read_only: true,
    },
    {
      signal: "marketplace_listing",
      workflow_key: UNONIGHT_WORKFLOW_MAP.marketplace_listing,
      queue_label: "Marketplace listing review",
      estimated_volume: "medium",
      read_only: true,
    },
    {
      signal: "admin_task",
      workflow_key: UNONIGHT_WORKFLOW_MAP.admin_task,
      queue_label: "Admin tasks",
      estimated_volume: "low",
      read_only: true,
    },
  ];

  return {
    findings: {
      adapter: "unonight_platform",
      pilot_stage: 1,
      queues_detected: queues,
      integration_capabilities: ["read_admin_signals", "workflow_mapping", "queue_metrics"],
      knowledge_needs: [
        "account_verification",
        "membership_levels",
        "marketplace_policies",
        "image_moderation",
        "gifts_wishlists",
      ],
    },
    recommendations: {
      enable_support_ai_draft: true,
      seed_knowledge: true,
      connect_integrations: ["unonight_platform", "supabase"],
      governance_mode: "enterprise_control",
      pilot_stage: 2,
      suggested_modules: ["knowledge_center", "support_ai", "governance", "basic_insights"],
    },
  };
}

export function mapUnonightSignalToWorkflowEvent(
  signal: UnonightSignalType,
  payload: { title: string; description?: string; source_id?: string }
): UnonightWorkflowEventInput {
  return {
    workflow_key: UNONIGHT_WORKFLOW_MAP[signal],
    event_type: "created",
    title: payload.title,
    description: payload.description,
    source_id: payload.source_id,
    metadata: { signal, adapter: "unonight_platform" },
  };
}

/** Sample sync events for pilot validation when live API is not yet connected. */
export function generatePilotSampleWorkflowEvents(): UnonightWorkflowEventInput[] {
  return [
    mapUnonightSignalToWorkflowEvent("account_verification_queue", {
      title: "Verification submitted",
      description: "New member submitted identity verification documents.",
      source_id: "pilot-sample-verification-1",
    }),
    mapUnonightSignalToWorkflowEvent("support_conversation", {
      title: "Support message received",
      description: "Member asked why account access is limited before verification.",
      source_id: "pilot-sample-support-1",
    }),
    mapUnonightSignalToWorkflowEvent("digital_product_pending", {
      title: "Digital product pending approval",
      description: "New digital listing awaiting moderator review.",
      source_id: "pilot-sample-product-1",
    }),
  ];
}

export function getUnonightAdapterMeta(preset: PilotProvisionConfig) {
  return {
    slug: preset.slug,
    adapter_key: "unonight_platform",
    workflow_count: preset.workflows.length,
    integration_count: preset.integrations.length,
    pilot_stage: preset.pilot_stage,
  };
}
