"use client";

import type { ReactNode } from "react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
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
  return (
    <ExecutiveCommandCenterRefreshProvider>
      <div className={`${AppPremiumShell.canvas} ${AppPremiumShell.page}`}>
        <div className={AppPremiumShell.sectionGap}>
          <ExecutiveCommandCenterHeader labels={labels} />
          <ExecutiveCommandCenterNav labels={labels.sections} />
          <main id="executive-command-center-content">{children}</main>
        </div>
      </div>
    </ExecutiveCommandCenterRefreshProvider>
  );
}
