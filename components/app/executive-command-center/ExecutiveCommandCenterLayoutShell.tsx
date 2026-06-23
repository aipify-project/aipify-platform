"use client";

import type { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { getEcc590ActiveSection } from "@/lib/executive-command-center-engine/config";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { ExecutiveCommandCenterHeader } from "./ExecutiveCommandCenterHeader";
import { ExecutiveCommandCenterNav } from "./ExecutiveCommandCenterNav";
import { ExecutiveCommandCenterRefreshProvider } from "./ExecutiveCommandCenterRefreshContext";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;

export function ExecutiveCommandCenterLayoutShell({
  labels,
  children,
}: {
  labels: Labels;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOverview = getEcc590ActiveSection(pathname, searchParams.get("tab")) === "overview";

  return (
    <ExecutiveCommandCenterRefreshProvider>
      <div className={`${AppPremiumShell.canvas} ${isOverview ? AppPremiumShell.commandBriefPage : AppPremiumShell.page}`}>
        <div className={isOverview ? "space-y-5" : AppPremiumShell.sectionGap}>
          <ExecutiveCommandCenterHeader labels={labels} />
          <ExecutiveCommandCenterNav labels={labels.sections} />
          <main id="executive-command-center-content" className="w-full min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ExecutiveCommandCenterRefreshProvider>
  );
}
