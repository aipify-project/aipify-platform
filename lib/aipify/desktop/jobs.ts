import { createClient } from "@/lib/supabase/server";
import { collectPresetDesktopEvents, presetEventsToRpcPayload } from "./collectors";

export async function collectDesktopEventsJob(tenantSlug?: string) {
  const supabase = await createClient();
  const preset = presetEventsToRpcPayload(collectPresetDesktopEvents(tenantSlug));
  if (preset.length > 0) {
    await supabase.rpc("upsert_desktop_notification_events_batch", { p_events: preset });
  }
  const { data, error } = await supabase.rpc("collect_desktop_notification_events");
  if (error) throw new Error(error.message);
  return data;
}

export async function deliverDesktopNotificationsJob() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("deliver_desktop_notifications");
  if (error) throw new Error(error.message);
  return data;
}
