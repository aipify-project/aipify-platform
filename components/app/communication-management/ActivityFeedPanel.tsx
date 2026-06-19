"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseActivityFeedCenter,
  type ActivityFeedCenter,
  type ActivityFeedLabels,
} from "@/lib/communication-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

export function ActivityFeedPanel({ labels }: { labels: ActivityFeedLabels }) {
  const [center, setCenter] = useState<ActivityFeedCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/activity");
    if (res.ok) setCenter(parseActivityFeedCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.communications_route ? (
          <Link href={center.communications_route} className="mt-3 inline-block text-sm text-indigo-700 hover:underline">{labels.communicationsLink}</Link>
        ) : null}
      </div>

      {(center.activity ?? []).length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="font-medium text-gray-900">{labels.noActivity}</p>
          <p className="mt-1 text-sm text-gray-600">{labels.noActivityHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {center.activity?.map((a) => (
            <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{a.activity_type}</p>
              <p className="mt-1 font-medium text-gray-900">{a.summary}</p>
              <p className="mt-2 text-xs text-gray-500">{new Date(a.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {(center.recent_tasks?.length ?? 0) > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.recentTasks}</h2>
          <div className="mt-3 space-y-2">
            {center.recent_tasks?.map((t) => (
              <div key={t.id} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <span className="font-medium">{t.title}</span>
                <span className="ml-2 text-gray-500">{t.status}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(center.recent_documents?.length ?? 0) > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.recentDocuments}</h2>
          <div className="mt-3 space-y-2">
            {center.recent_documents?.map((d) => (
              <div key={d.id} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <span className="font-medium">{d.title}</span>
                <span className="ml-2 text-gray-500">{d.status}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
