import { DesktopCompanionFoundationShell } from "@/components/app/desktop";
import { DesktopCompanionFocusPanel } from "@/components/app/desktop/DesktopCompanionFocusPanel";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopFocusPage() {
  const labels = await getDesktopCompanionPageLabels();
  return (
    <DesktopCompanionFoundationShell labels={labels}>
      <DesktopCompanionFocusPanel labels={labels} />
    </DesktopCompanionFoundationShell>
  );
}
