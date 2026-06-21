"use client";

import { useMemo, useState } from "react";
import type { PublicMarketingPlanKey } from "@/lib/marketing/public-pricing";

export type ComparisonRow = {
  id: string;
  group: string;
  label: string;
  starter: string;
  professional: string;
  business: string;
  enterprise: string;
};

type Props = {
  rows: ComparisonRow[];
  planLabels: Record<PublicMarketingPlanKey, string>;
  mobileHint: string;
};

const PLAN_KEYS: PublicMarketingPlanKey[] = ["starter", "professional", "business", "enterprise"];

export default function PricingComparisonTable({ rows, planLabels, mobileHint }: Props) {
  const groups = useMemo(() => {
    const map = new Map<string, ComparisonRow[]>();
    for (const row of rows) {
      const list = map.get(row.group) ?? [];
      list.push(row);
      map.set(row.group, list);
    }
    return [...map.entries()];
  }, [rows]);

  const [mobileA, setMobileA] = useState<PublicMarketingPlanKey>("starter");
  const [mobileB, setMobileB] = useState<PublicMarketingPlanKey>("business");

  return (
    <>
      <p className="mb-6 text-sm text-aipify-text-secondary lg:hidden">{mobileHint}</p>
      <div className="space-y-4 lg:hidden">
        <div className="grid grid-cols-2 gap-3">
          {([mobileA, mobileB] as const).map((key, i) => (
            <label key={key} className="text-sm font-medium text-aipify-text-secondary">
              {i === 0 ? "Plan A" : "Plan B"}
              <select
                value={key}
                onChange={(e) => (i === 0 ? setMobileA : setMobileB)(e.target.value as PublicMarketingPlanKey)}
                className="mt-1 w-full rounded-xl border border-aipify-border bg-aipify-surface px-3 py-2 text-sm text-aipify-text"
              >
                {PLAN_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {planLabels[k]}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        {groups.map(([group, groupRows]) => (
          <details key={group} className="rounded-xl border border-aipify-border bg-aipify-surface">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-aipify-text">{group}</summary>
            <dl className="border-t border-aipify-border px-4 py-3">
              {groupRows.map((row) => (
                <div key={row.id} className="border-b border-aipify-border py-3 last:border-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-aipify-text-secondary">{row.label}</dt>
                  <dd className="mt-2 grid grid-cols-2 gap-3 text-sm text-aipify-text">
                    <div>
                      <span className="block text-xs text-aipify-text-muted">{planLabels[mobileA]}</span>
                      {row[mobileA]}
                    </div>
                    <div>
                      <span className="block text-xs text-aipify-text-muted">{planLabels[mobileB]}</span>
                      {row[mobileB]}
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </details>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-aipify-border">
              <th scope="col" className="sticky left-0 bg-aipify-canvas px-4 py-3 font-semibold text-aipify-text">
                Capability
              </th>
              {PLAN_KEYS.map((key) => (
                <th key={key} scope="col" className="px-4 py-3 font-semibold text-aipify-text">
                  {planLabels[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.flatMap(([group, groupRows]) => [
              <tr key={`${group}-header`} className="bg-aipify-surface-muted">
                <th colSpan={5} scope="colgroup" className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-aipify-companion">
                  {group}
                </th>
              </tr>,
              ...groupRows.map((row) => (
                <tr key={row.id} className="border-b border-aipify-border">
                  <th scope="row" className="sticky left-0 bg-aipify-canvas px-4 py-3 font-medium text-aipify-text">
                    {row.label}
                  </th>
                  {PLAN_KEYS.map((key) => (
                    <td key={key} className="px-4 py-3 text-aipify-text-secondary">
                      {row[key]}
                    </td>
                  ))}
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
    </>
  );
}
