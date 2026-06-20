"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseServiceExperienceCenter, type ServiceExperienceCenter } from "@/lib/service-experience-engine";
import type { ServiceRebookingLabels } from "@/lib/service-experience-engine/labels";
import { ExperienceItemList, ExperienceStatGrid } from "./ExperienceShared";

export function ServiceRebookingPanel({ labels }: { labels: ServiceRebookingLabels }) {
  const [center, setCenter] = useState<ServiceExperienceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/services/rebooking?section=overview");
    if (res.ok) setCenter(parseServiceExperienceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
      </div>
    );
  }

  const stats = center.stats ?? {};
  const rows = [...(center.recommendations ?? []), ...(center.actions ?? []), ...(center.records ?? [])];

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600">{center.principle}</p>
      <ExperienceStatGrid
        items={[
          { label: labels.stats.rebookingDue, value: stats.rebooking_due ?? 0 },
          { label: labels.stats.rebooked, value: stats.rebooked ?? 0 },
          { label: labels.stats.remindersSent, value: stats.reminders_sent ?? 0 },
        ]}
      />
      <ExperienceItemList rows={rows} emptyLabel={labels.noRecords} />
      {center.privacy_note ? <p className="text-xs text-zinc-500">{center.privacy_note}</p> : null}
    </div>
  );
}
