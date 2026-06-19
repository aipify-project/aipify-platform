"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parsePlatformCustomerSuccessHubCenter,
  type PlatformCustomerSuccessHubCenter,
  type PlatformCustomerSuccessHubLabels,
  type PlaybookRow,
} from "@/lib/platform-customer-success-hub";

type Props = {
  labels: PlatformCustomerSuccessHubLabels;
  backHref: string;
};

export function PlatformCustomerSuccessPlaybooksPanel({ labels, backHref }: Props) {
  const [center, setCenter] = useState<PlatformCustomerSuccessHubCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-customer-success-hub/overview?section=playbooks");
    if (res.ok) setCenter(parsePlatformCustomerSuccessHubCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  const playbooks = center?.playbooks ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.playbooks.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {playbooks.map((pb: PlaybookRow) => (
          <div key={pb.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase text-zinc-500">
              {labels.playbookTypes[pb.playbook_type] ?? pb.playbook_type}
            </p>
            <p className="mt-1 font-semibold text-zinc-900">{pb.title}</p>
            {pb.description ? <p className="mt-2 text-sm text-zinc-600">{pb.description}</p> : null}
            {Array.isArray(pb.steps) && pb.steps.length ? (
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-700">
                {pb.steps.map((step) => (
                  <li key={String(step)}>{String(step)}</li>
                ))}
              </ol>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
