import Link from "next/link";
import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopKnowledgePage() {
  const labels = await getDesktopCompanionPageLabels();
  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-semibold">{labels["nav.knowledge"]}</h1>
        <Link href="/app/knowledge-center" className="mt-4 inline-block text-sm text-indigo-700">
          Open Knowledge Center →
        </Link>
      </section>
    </DesktopCompanionFoundationShell>
  );
}
