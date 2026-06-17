import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopCalendarPage() {
  const labels = await getDesktopCompanionPageLabels();
  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-semibold">{labels.calendar}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.permissionsNote}</p>
      </section>
    </DesktopCompanionFoundationShell>
  );
}
