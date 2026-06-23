import type { SupabaseClient } from "@supabase/supabase-js";
import type { Translator } from "@/lib/i18n/translate";

export type PlayfulFoxBellResult = {
  notification_id: string | null;
  dedupe_key: string;
  created: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

async function resolveTenantId(
  supabase: SupabaseClient,
  companyId: string | null | undefined,
): Promise<string | null> {
  if (!companyId) return null;
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("company_id", companyId)
    .maybeSingle();
  return customer?.id ? String(customer.id) : null;
}

async function hasExistingDedupeNotification(
  supabase: SupabaseClient,
  dedupeKey: string,
  tenantId: string | null,
): Promise<boolean> {
  if (tenantId) {
    const { data: workerDedupe, error: workerError } = await supabase.rpc(
      "companion_worker_has_presence_dedupe",
      {
        p_tenant_id: tenantId,
        p_dedupe_key: dedupeKey,
      },
    );
    if (!workerError) {
      const workerRecord = asRecord(workerDedupe);
      if (typeof workerRecord?.exists === "boolean") {
        return workerRecord.exists;
      }
    }
  }

  const { data } = await supabase.rpc("list_presence_notifications", {
    p_limit: 40,
    p_unread_only: false,
  });
  const payload = asRecord(data);
  const notifications = Array.isArray(payload?.notifications) ? payload.notifications : [];
  return notifications.some((entry) => {
    const row = asRecord(entry);
    const metadata = asRecord(row?.metadata);
    return metadata?.dedupe_key === dedupeKey;
  });
}

/** Creates one deduplicated playful bell notification via the central presence system. */
export async function recordPlayfulFoxBellNotification(
  supabase: SupabaseClient,
  input: {
    t: Translator;
    companyId?: string | null;
    conversationId?: string | null;
    bellText: string;
  },
): Promise<PlayfulFoxBellResult> {
  const dedupeKey = `playful_fox:${input.conversationId?.trim() || "companion-session"}`;

  const tenantId = await resolveTenantId(supabase, input.companyId);
  if (!tenantId) {
    return { notification_id: null, dedupe_key: dedupeKey, created: false };
  }

  if (await hasExistingDedupeNotification(supabase, dedupeKey, tenantId)) {
    return { notification_id: null, dedupe_key: dedupeKey, created: false };
  }

  const title = input.t("customerApp.companionPlatformKnowledge.foundation.foxBellTitle");
  const body = input.bellText.trim() || input.t("customerApp.companionPlatformKnowledge.foundation.foxBellBody");

  const { data: notificationId, error } = await supabase.rpc("record_presence_notification", {
    p_tenant_id: tenantId,
    p_event_type: "playful_bell_moment",
    p_level: "informational",
    p_title: title,
    p_body: body,
    p_channels: ["in_app"],
    p_actions: [],
    p_action_href: "/app/companion",
    p_metadata: {
      dedupe_key: dedupeKey,
      context: "fox_spoken",
      signature: "bell",
      source: "platform_foundation",
      conversation_id: input.conversationId ?? null,
    },
  });

  if (error) {
    return { notification_id: null, dedupe_key: dedupeKey, created: false };
  }

  return {
    notification_id: notificationId ? String(notificationId) : null,
    dedupe_key: dedupeKey,
    created: true,
  };
}
