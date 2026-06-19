"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseServiceIntakeDetail } from "@/lib/service-intake-engine";
import type { ServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
export function ServiceIntakeDetailPanel({ labels, entityType, entityKey }: { labels: ServiceIntakeLabels; entityType: "form" | "submission"; entityKey: string }) {
  const [detail, setDetail] = useState(parseServiceIntakeDetail(null));
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ entityType, entityKey });
    const res = await fetch(`/api/services/intake/detail?${params.toString()}`);
    setDetail(res.ok ? parseServiceIntakeDetail(await res.json()) : parseServiceIntakeDetail({ found: false }));
    setLoading(false);
  }, [entityType, entityKey]);
  useEffect(() => { void load(); }, [load]);
  const backHref = entityType === "form" ? "/app/services/forms" : "/app/services/submissions";
  if (loading) return (<div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /><span className="sr-only">{labels.loading}</span></div>);
  if (!detail.found || !detail.record) return (<div className="space-y-4"><Link href={backHref} className="text-sm font-medium text-violet-700 hover:underline">← {labels.detail.back}</Link><div className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><p className="font-medium">{labels.detail.notFound}</p></div></div>);
  const record = detail.record;
  const ready = detail.readiness?.ready === true;
  return (<div className="space-y-6"><Link href={backHref} className="text-sm font-medium text-violet-700 hover:underline">← {labels.detail.back}</Link><div><p className="text-xs uppercase text-zinc-500">{entityType === "form" ? labels.entityTypes.form : labels.entityTypes.submission}</p><h2 className="mt-1 text-xl font-semibold">{String(record.record_title ?? entityKey)}</h2></div>{detail.readiness ? (<div className={`rounded-2xl border px-5 py-4 text-sm ${ready ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><p className="font-medium">{ready ? labels.readiness.ready : labels.readiness.blocked}</p></div>) : null}</div>);
}
