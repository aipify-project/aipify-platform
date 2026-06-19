"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ServiceNetworkNav } from "./ServiceNetworkNav";
import { ServicePaymentsNav } from "@/components/app/service-payments";
import { ServiceIntakeShell } from "@/components/app/service-intake";
import type { ServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import type { ServicePaymentsLabels } from "@/lib/service-payments-engine/labels";
import type { ServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import { isServiceIntakePath } from "@/lib/service-intake-engine/config";

export function ServicesAreaChrome({ networkLabels, paymentsLabels, intakeLabels, children }: { networkLabels: ServiceNetworkLabels; paymentsLabels: ServicePaymentsLabels; intakeLabels: ServiceIntakeLabels; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/app/services/payments")) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{paymentsLabels.title}</h1>
          <p className="mt-2 text-gray-600">{paymentsLabels.subtitle}</p>
        </div>
        <ServicePaymentsNav labels={paymentsLabels.sections} />
        {children}
      </div>
    );
  }
  if (isServiceIntakePath(pathname)) {
    return <ServiceIntakeShell labels={intakeLabels}>{children}</ServiceIntakeShell>;
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{networkLabels.title}</h1>
        <p className="mt-2 text-gray-600">{networkLabels.subtitle}</p>
      </div>
      <ServiceNetworkNav labels={networkLabels.sections} />
      {children}
    </div>
  );
}
