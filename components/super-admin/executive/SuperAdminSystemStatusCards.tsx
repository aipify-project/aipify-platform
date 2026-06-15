"use client";

import { humanizeTranslationKey } from "@/lib/i18n/humanize-key";
import type { SuperAdminPlatformStatus, SuperAdminSystemService } from "@/lib/super-admin/types";

type SuperAdminSystemStatusCardsProps = {
  services: SuperAdminSystemService[];
  labels: {
    title: string;
    lastCheck: string;
    lastCheckSeconds: string;
    avgResponse: string;
    avgResponseMs: string;
    uptimeTrend: string;
    uptimeTrendValue: string;
    setupProgress: string;
    statusOperational: string;
    statusPendingSetup: string;
    statusAttentionRequired: string;
    services: Record<string, string>;
  };
};

function statusLabel(status: SuperAdminPlatformStatus, labels: SuperAdminSystemStatusCardsProps["labels"]) {
  if (status === "attention_required") return labels.statusAttentionRequired;
  if (status === "pending_setup") return labels.statusPendingSetup;
  return labels.statusOperational;
}

function statusTone(status: SuperAdminPlatformStatus) {
  if (status === "attention_required") {
    return {
      badge: "border-red-200 bg-red-50 text-red-800",
      dot: "bg-red-500",
    };
  }
  if (status === "pending_setup") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-900",
      dot: "bg-amber-500",
    };
  }
  return {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-900",
    dot: "bg-emerald-500",
  };
}

function serviceName(id: string, labels: SuperAdminSystemStatusCardsProps["labels"]) {
  return labels.services[id] ?? humanizeTranslationKey(`superAdmin.systemStatus.services.${id}`);
}

export default function SuperAdminSystemStatusCards({
  services,
  labels,
}: SuperAdminSystemStatusCardsProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{labels.title}</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const tone = statusTone(service.status);
          const name = serviceName(service.id, labels);
          return (
            <li
              key={service.id}
              className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-900">{name}</p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tone.badge}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden />
                  {statusLabel(service.status, labels)}
                </span>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                {labels.lastCheck}{" "}
                <span className="font-medium text-zinc-700">
                  {labels.lastCheckSeconds.replace(
                    "{seconds}",
                    String(service.last_check_seconds_ago)
                  )}
                </span>
              </p>
              {typeof service.response_time_ms === "number" ? (
                <p className="mt-1 text-xs text-zinc-500">
                  {labels.avgResponse}{" "}
                  <span className="font-medium text-zinc-700">
                    {labels.avgResponseMs.replace("{ms}", String(service.response_time_ms))}
                  </span>
                </p>
              ) : null}
              {typeof service.uptime_trend_pct === "number" ? (
                <p className="mt-1 text-xs text-zinc-500">
                  {labels.uptimeTrend}{" "}
                  <span className="font-medium text-zinc-700">
                    {labels.uptimeTrendValue.replace("{pct}", String(service.uptime_trend_pct))}
                  </span>
                </p>
              ) : null}
              {service.status === "pending_setup" &&
              typeof service.setup_steps_completed === "number" &&
              typeof service.setup_steps_total === "number" ? (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-950">
                  {labels.setupProgress
                    .replace("{completed}", String(service.setup_steps_completed))
                    .replace("{total}", String(service.setup_steps_total))}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
