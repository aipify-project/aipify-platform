import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { DesktopCompanionSearchPanel } from "@/components/app/desktop/DesktopCompanionSearchPanel";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopSearchPage() {
  const labels = await getDesktopCompanionPageLabels();
  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <DesktopCompanionSearchPanel labels={labels} />
    </DesktopCompanionFoundationShell>
  );
}
