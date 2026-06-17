import Link from "next/link";
import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopBriefingsPage() {
  const labels = await getDesktopCompanionPageLabels();
  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-semibold">{labels["nav.briefings"]}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.dailyBriefing}</p>
        <Link href="/app/companion/daily-briefing" className="mt-4 inline-block text-sm text-indigo-700">
          Open Daily Briefing Center →
        </Link>
      </section>
    </DesktopCompanionFoundationShell>
  );
}
