import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";
import { createClient } from "@/lib/supabase/server";
import { parseDesktopCompanionTasks } from "@/lib/desktop-companion-foundation";

export default async function DesktopTasksPage() {
  const labels = await getDesktopCompanionPageLabels();
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_desktop_companion_tasks");
  const tasks = parseDesktopCompanionTasks(data);

  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-semibold">{labels.tasks}</h1>
        <ul className="mt-4 space-y-2 text-sm">
          {tasks.items.map((task, i) => (
            <li key={task.id ?? i} className="rounded border border-gray-100 p-3">
              {task.title}
            </li>
          ))}
          {tasks.items.length === 0 ? <li className="text-gray-500">—</li> : null}
        </ul>
      </section>
    </DesktopCompanionFoundationShell>
  );
}
