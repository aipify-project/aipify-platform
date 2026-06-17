import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";
import { createClient } from "@/lib/supabase/server";
import { parseDesktopCompanionNotifications } from "@/lib/desktop-companion-foundation";

export default async function DesktopNotificationsPage() {
  const labels = await getDesktopCompanionPageLabels();
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_desktop_companion_notifications");
  const notifications = parseDesktopCompanionNotifications(data);

  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-semibold">{labels.notificationsTitle}</h1>
        <ul className="mt-4 space-y-2 text-sm">
          {notifications.items.map((n) => (
            <li key={n.id} className="rounded border border-gray-100 p-3">
              <span className="text-xs uppercase text-gray-400">{n.level ?? n.severity}</span>
              <p className="font-medium">{n.title}</p>
            </li>
          ))}
          {notifications.items.length === 0 ? <li className="text-gray-500">—</li> : null}
        </ul>
      </section>
    </DesktopCompanionFoundationShell>
  );
}
