"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  Link2,
  Megaphone,
  MessageSquare,
  Rocket,
  Wallet,
} from "lucide-react";
import type { CspHelpLabels } from "@/lib/partners-portal/csp-section-labels";
import { AipifyCard, AipifyPageHeader } from "./design";

export type { CspHelpLabels };

const SECTION_ICONS: Record<string, typeof Rocket> = {
  gettingStarted: Rocket,
  academy: GraduationCap,
  salesLinks: Link2,
  commission: BookOpen,
  payouts: Wallet,
  materials: Megaphone,
  contact: MessageSquare,
};

export function CertifiedSalesPartnerHelpPanel({ labels }: { labels: CspHelpLabels }) {
  return (
    <div className="w-full space-y-5">
      <AipifyPageHeader title={labels.title} description={labels.intro} eyebrow="Aipify" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {labels.sections.map((section) => {
          const Icon = SECTION_ICONS[section.id] ?? HelpCircle;
          return (
            <AipifyCard key={section.id} as="article" padding="md">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EDFF] text-[#7C3AED]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-3 font-semibold text-[#1E293B]">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{section.body}</p>
              {section.href && section.cta ? (
                <Link
                  href={section.href}
                  className="mt-4 inline-flex text-sm font-semibold text-[#7C3AED] hover:underline"
                >
                  {section.cta}
                </Link>
              ) : null}
            </AipifyCard>
          );
        })}
      </div>
      {labels.sharedApp.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[#1E293B]">{labels.sharedAppTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {labels.sharedApp.map((item) => (
              <AipifyCard key={item.id} as="article" padding="md">
                <h3 className="font-semibold text-[#1E293B]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{item.body}</p>
                <Link
                  href={item.href}
                  className="mt-4 inline-flex text-sm font-semibold text-[#7C3AED] hover:underline"
                >
                  {item.cta}
                </Link>
              </AipifyCard>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
