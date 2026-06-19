import type { ReactNode } from "react";
import { AbsenceCoverageNav } from "@/components/app/absence-coverage";
import { PartnerAbsenceCoverageLayoutHeader } from "@/lib/absence-coverage-engine/partner-section-page";

export default async function PartnersAbsenceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <PartnerAbsenceCoverageLayoutHeader />
      {children}
    </div>
  );
}
