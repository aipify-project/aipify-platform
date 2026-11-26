"use client";

import Link from "next/link";
import type { CspHelpLabels } from "@/lib/partners-portal/csp-section-labels";
import { AipifyCard, AipifyPageHeader } from "./design";

export type { CspHelpLabels };

export function CertifiedSalesPartnerHelpPanel({ labels }: { labels: CspHelpLabels }) {
  return (
    <div className="w-full space-y-5">
      <AipifyPageHeader title={labels.title} description={labels.intro} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {labels.sections.map((section) => (
          <AipifyCard key={section.id} as="article" padding="md">
            <h3 className="font-semibold text-[#1E293B]">{section.title}</h3>
            <p className="mt-2 text-sm text-[#64748B]">{section.body}</p>
            {section.href && section.cta ? (
              <Link
                href={section.href}
                className="mt-4 inline-flex text-sm font-semibold text-[#7C3AED] hover:underline"
              >
                {section.cta}
              </Link>
            ) : null}
          </AipifyCard>
        ))}
      </div>
    </div>
  );
}
