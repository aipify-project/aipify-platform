"use client";

import { AbsenceCoveragePanel } from "@/components/app/absence-coverage";
import type { Vac606Section } from "@/lib/absence-coverage-engine/config";
import type { buildAbsenceCoverageLabels } from "@/lib/absence-coverage-engine/labels";

type Labels = ReturnType<typeof buildAbsenceCoverageLabels>;

export function PartnerAbsenceCoveragePanel({
  activeSection,
  labels,
}: {
  activeSection: Vac606Section;
  labels: Labels;
}) {
  return (
    <AbsenceCoveragePanel
      labels={labels}
      activeSection={activeSection}
      apiBase="/api/partners/absence/center"
    />
  );
}
