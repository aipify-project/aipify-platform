"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import type { CustomerApproval } from "@/lib/app/customer-app";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type ApprovalsCenterPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    openActionCenter: string;
    statusLabels: Record<string, string>;
    categoryLabels: Record<string, string>;
  };
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-rose-100 text-rose-900",
  completed: "bg-gray-100 text-gray-700",
};

export function ApprovalsCenterPanel({ locale, labels }: ApprovalsCenterPanelProps) {
  const [items, setItems] = useState<CustomerApproval[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_customer_approvals_center");
    if (!error && data?.has_customer) {
      setItems((data.approvals as CustomerApproval[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>

      {items.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-gray-900">{item.title}</h2>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status] ?? STATUS_STYLES.pending}`}
                >
                  {labels.statusLabels[item.status] ?? item.status}
                </span>
                <span className="text-xs text-gray-500">
                  {labels.categoryLabels[item.category] ?? item.category}
                </span>
              </div>
              {item.description && (
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">{formatDate(item.created_at, locale)}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-gray-500">
        <Link href="/app/command-center" className="text-indigo-600 hover:underline">
          {labels.openActionCenter}
        </Link>
      </p>
    </div>
  );
}
