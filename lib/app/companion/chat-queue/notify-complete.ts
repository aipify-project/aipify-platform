import type { SupabaseClient } from "@supabase/supabase-js";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { CoreLocale } from "@/lib/i18n/config";
import { isCoreLocale } from "@/lib/i18n/config";

export async function notifyCompanionReplyReady(
  supabase: SupabaseClient,
  input: {
    conversationId: string;
    question: string;
    locale: string;
  },
): Promise<void> {
  const profile = await getDashboardProfile(supabase);
  if (!profile) return;

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("company_id", profile.company.id)
    .maybeSingle();

  const tenantId = customer?.id;
  if (!tenantId) return;

  const locale = (isCoreLocale(input.locale) ? input.locale : "en") as CoreLocale;
  const dict = await getCustomerAppDictionaryForSplits(locale, ["companion"]);
  const t = createTranslator(dict);
  const title = t("customerApp.companionExperience.queue.notificationTitle");
  const body = t("customerApp.companionExperience.queue.notificationBody").replace(
    "{question}",
    input.question.slice(0, 120),
  );
  const actionHref = `/app/companion?conversation=${encodeURIComponent(input.conversationId)}`;

  await supabase.rpc("record_presence_notification", {
    p_tenant_id: tenantId,
    p_event_type: "companion_reply_ready",
    p_level: "informational",
    p_title: title,
    p_body: body,
    p_channels: ["in_app"],
    p_actions: [],
    p_action_href: actionHref,
    p_metadata: {
      conversation_id: input.conversationId,
      source: "companion_chat_queue",
    },
  });
}
