"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ServiceCommunicationsNav } from "./ServiceCommunicationsNav";
import type { ServiceCommunicationsLabels } from "@/lib/service-experience-engine/labels";
import type { ServiceRebookingLabels, ServiceFeedbackLabels, ServiceQualityLabels } from "@/lib/service-experience-engine/labels";

const EXPERIENCE_LINKS = [
  { href: "/app/services/communications", key: "communications" as const },
  { href: "/app/services/rebooking", key: "rebooking" as const },
  { href: "/app/services/feedback", key: "feedback" as const },
  { href: "/app/services/quality", key: "quality" as const },
];

export function ServiceExperienceAreaNav({
  labels,
}: {
  labels: {
    communications: string;
    rebooking: string;
    feedback: string;
    quality: string;
  };
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Service experience areas" className="flex flex-wrap gap-2">
      {EXPERIENCE_LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              active ? "bg-violet-100 text-violet-800 ring-1 ring-violet-200" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {labels[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}

export function ServiceCommunicationsShell({
  labels,
  areaLabels,
  children,
}: {
  labels: ServiceCommunicationsLabels;
  areaLabels: { communications: string; rebooking: string; feedback: string; quality: string };
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <ServiceExperienceAreaNav labels={areaLabels} />
      <ServiceCommunicationsNav labels={labels.sections} />
      {children}
    </div>
  );
}

export function ServiceExperienceSimpleShell({
  title,
  subtitle,
  areaLabels,
  children,
}: {
  title: string;
  subtitle: string;
  areaLabels: { communications: string; rebooking: string; feedback: string; quality: string };
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">{subtitle}</p>
      </div>
      <ServiceExperienceAreaNav labels={areaLabels} />
      {children}
    </div>
  );
}

export type { ServiceRebookingLabels, ServiceFeedbackLabels, ServiceQualityLabels };
