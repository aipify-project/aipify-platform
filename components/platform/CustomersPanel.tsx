"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PlatformCustomerSummary } from "@/lib/tenant/types";

type CustomersPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    installations: string;
    users: string;
    pilotNote: string;
  };
};

export default function CustomersPanel({ labels }: CustomersPanelProps) {
  const [customers, setCustomers] = useState<PlatformCustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_customers");

      if (!cancelled) {
        setCustomers(error || !data ? [] : (data as PlatformCustomerSummary[]));
        setLoading(false);
      }
    }

    void loadCustomers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </div>

      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900">
        {labels.pilotNote}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : customers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-sm text-gray-500">
          {labels.empty}
        </p>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {customer.name}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-gray-500">
                    {customer.slug}
                  </p>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>
                    {customer.installation_count} {labels.installations}
                  </span>
                  <span>
                    {customer.user_count} {labels.users}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
