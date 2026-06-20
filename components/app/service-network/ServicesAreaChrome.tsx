"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ServiceNetworkNav } from "./ServiceNetworkNav";
import { ServicePaymentsNav } from "@/components/app/service-payments";
import { ServiceIntakeShell } from "@/components/app/service-intake";
import { ServiceCommunicationsShell, ServiceExperienceSimpleShell } from "@/components/app/service-experience";
import type { ServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import type { ServicePaymentsLabels } from "@/lib/service-payments-engine/labels";
import type { ServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import type {
  ServiceCommunicationsLabels,
  ServiceRebookingLabels,
  ServiceFeedbackLabels,
  ServiceQualityLabels,
} from "@/lib/service-experience-engine/labels";
import { isServiceIntakePath } from "@/lib/service-intake-engine/config";
import { isServiceCommunicationsPath, isServiceExperiencePath } from "@/lib/service-experience-engine/communications-config";

export function ServicesAreaChrome({
  networkLabels,
  paymentsLabels,
  intakeLabels,
  communicationsLabels,
  rebookingLabels,
  feedbackLabels,
  qualityLabels,
  areaLabels,
  children,
}: {
  networkLabels: ServiceNetworkLabels;
  paymentsLabels: ServicePaymentsLabels;
  intakeLabels: ServiceIntakeLabels;
  communicationsLabels: ServiceCommunicationsLabels;
  rebookingLabels: ServiceRebookingLabels;
  feedbackLabels: ServiceFeedbackLabels;
  qualityLabels: ServiceQualityLabels;
  areaLabels: { communications: string; rebooking: string; feedback: string; quality: string };
  children: ReactNode;
}) {
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
  if (isServiceCommunicationsPath(pathname)) {
    return (
      <ServiceCommunicationsShell labels={communicationsLabels} areaLabels={areaLabels}>
        {children}
      </ServiceCommunicationsShell>
    );
  }
  if (pathname.startsWith("/app/services/rebooking")) {
    return (
      <ServiceExperienceSimpleShell title={rebookingLabels.title} subtitle={rebookingLabels.subtitle} areaLabels={areaLabels}>
        {children}
      </ServiceExperienceSimpleShell>
    );
  }
  if (pathname.startsWith("/app/services/feedback")) {
    return (
      <ServiceExperienceSimpleShell title={feedbackLabels.title} subtitle={feedbackLabels.subtitle} areaLabels={areaLabels}>
        {children}
      </ServiceExperienceSimpleShell>
    );
  }
  if (pathname.startsWith("/app/services/quality")) {
    return (
      <ServiceExperienceSimpleShell title={qualityLabels.title} subtitle={qualityLabels.subtitle} areaLabels={areaLabels}>
        {children}
      </ServiceExperienceSimpleShell>
    );
  }
  if (isServiceExperiencePath(pathname)) {
    return <>{children}</>;
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
