import Link from "next/link";
import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { QUICK_ACTION_IDS } from "@/lib/desktop-companion-foundation/constants";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopActionsPage() {
  const labels = await getDesktopCompanionPageLabels();
  const quickLabels: Record<string, string> = {
    create_note: labels["quick.createNote"],
    create_task: labels["quick.createTask"],
    create_reminder: labels["quick.createReminder"],
    open_calendar: labels["quick.openCalendar"],
    open_file: labels["quick.openFile"],
    start_focus: labels["quick.startFocus"],
    ask_aipify: labels["quick.askAipify"],
  };

  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-semibold">{labels.quickActions}</h1>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {QUICK_ACTION_IDS.map((id) => (
            <Link
              key={id}
              href={
                id === "start_focus"
                  ? "/app/desktop/focus"
                  : id === "ask_aipify"
                    ? "/app/desktop/companion"
                    : "/app/desktop"
              }
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50"
            >
              {quickLabels[id]}
            </Link>
          ))}
        </div>
      </section>
    </DesktopCompanionFoundationShell>
  );
}
