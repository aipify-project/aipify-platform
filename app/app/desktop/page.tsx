import {
  DesktopCompanionFoundationShell,
  DesktopCompanionHomePanel,
  DesktopCompanionSidebar,
} from "@/components/app/desktop";
import { getDesktopCompanionPageLabels } from "@/lib/desktop-companion-foundation/page-labels";

export default async function DesktopPage() {
  const labels = await getDesktopCompanionPageLabels();

  return (
    <DesktopCompanionFoundationShell labels={labels} sidebar={<DesktopCompanionSidebar labels={labels} />}>
      <DesktopCompanionHomePanel labels={labels} />
    </DesktopCompanionFoundationShell>
  );
}
