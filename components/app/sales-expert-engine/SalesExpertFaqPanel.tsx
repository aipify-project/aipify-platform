"use client";

import Link from "next/link";
import { SALES_EXPERT_FAQ_SECTIONS } from "@/lib/aipify/sales-expert-engine/faq-sections";

type SalesExpertFaqPanelProps = {
  labels: Record<string, string>;
};

export function SalesExpertFaqPanel({ labels }: SalesExpertFaqPanelProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.openKnowledgeCenter}
        </Link>
        <Link href="/app/marketplace-partner-ecosystem-foundation-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.partnerEcosystem}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.faqIntroTitle}</h2>
        <p className="mt-2 text-sm text-indigo-900">{labels.faqIntroBody}</p>
      </section>

      {SALES_EXPERT_FAQ_SECTIONS.map((section) => (
        <section key={section.id} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{labels[section.labelKey]}</h2>
          <dl className="space-y-4">
            {section.items.map((item) => (
              <div key={item.qKey} className="rounded-xl border border-gray-200 bg-white p-4">
                <dt className="text-sm font-semibold text-gray-900">{labels[item.qKey]}</dt>
                <dd className="mt-2 whitespace-pre-line text-sm text-gray-700">{labels[item.aKey]}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <p className="text-sm text-gray-700">{labels.faqVisionClosing}</p>
      </section>
    </div>
  );
}
