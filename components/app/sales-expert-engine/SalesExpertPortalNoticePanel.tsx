"use client";

import {
  SALES_EXPERT_PORTAL_NOTICE_SECTIONS,
} from "@/lib/aipify/sales-expert-engine/portal-notice-sections";

type SalesExpertPortalNoticePanelProps = {
  labels: Record<string, string>;
};

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-gray-700">
          <span className="text-emerald-600" aria-hidden>
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SalesExpertPortalNoticePanel({ labels }: SalesExpertPortalNoticePanelProps) {
  const relationshipSection = SALES_EXPERT_PORTAL_NOTICE_SECTIONS.find((s) => s.id === "relationship");
  const aipifyList = relationshipSection?.listKeys?.slice(0, 5).map((k) => labels[k]).filter(Boolean) ?? [];
  const expertList = relationshipSection?.listKeys?.slice(5).map((k) => labels[k]).filter(Boolean) ?? [];

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
        {labels["portalNotice.badge"]}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-gray-900">{labels["portalNotice.title"]}</h2>
      <p className="mt-2 text-sm font-medium text-gray-900">{labels["portalNotice.welcome"]}</p>
      <p className="mt-1 text-sm text-gray-700">{labels["portalNotice.intro"]}</p>

      <div className="mt-6 space-y-6">
        {SALES_EXPERT_PORTAL_NOTICE_SECTIONS.map((section) => {
          if (section.id === "relationship") {
            return (
              <div key={section.id}>
                <h3 className="text-sm font-semibold text-gray-900">{labels[section.titleKey]}</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-amber-100 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {labels["portalNotice.aipifyManagesTitle"]}
                    </p>
                    <CheckList items={aipifyList} />
                  </div>
                  <div className="rounded-lg border border-amber-100 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {labels["portalNotice.expertsManageTitle"]}
                    </p>
                    <CheckList items={expertList} />
                  </div>
                </div>
              </div>
            );
          }

          const body = (section.bodyKeys ?? []).map((k) => labels[k]).filter(Boolean);
          const list = (section.listKeys ?? []).map((k) => labels[k]).filter(Boolean);

          return (
            <div key={section.id}>
              <h3 className="text-sm font-semibold text-gray-900">{labels[section.titleKey]}</h3>
              {body.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-sm text-gray-700">
                  {paragraph}
                </p>
              ))}
              {section.id === "starting" && list.length > 0 ? (
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
                  {list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.id === "starting" ? (
                <p className="mt-2 text-sm text-gray-600 italic">{labels["portalNotice.consultAdvisors"]}</p>
              ) : null}
              {section.id !== "starting" && list.length > 0 ? <CheckList items={list} /> : null}
            </div>
          );
        })}

        <div className="border-t border-amber-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels["portalNotice.finalThoughtTitle"]}</h3>
          <p className="mt-2 text-sm text-gray-700">{labels["portalNotice.finalThought1"]}</p>
          <p className="mt-2 text-sm text-gray-700">{labels["portalNotice.finalThought2"]}</p>
          <p className="mt-2 text-sm text-gray-700">{labels["portalNotice.finalThought3"]}</p>
          <p className="mt-3 text-sm font-medium text-amber-900">{labels["portalNotice.finalThoughtClosing"]}</p>
        </div>
      </div>
    </section>
  );
}
