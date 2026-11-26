"use client";

import type { PlatformSupportTicketsListItem } from "@/lib/platform-portal/support-tickets-read-adapter";

export type SupportFlash = { tone: "success" | "error" | "info"; text: string };

export function statusTone(status: string): string {
  const s = status.toLowerCase();
  if (s === "resolved" || s === "closed") {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
  if (s === "waiting_for_customer" || s === "waiting_internal") {
    return "bg-amber-50 text-amber-900 border-amber-200";
  }
  if (s === "new" || s === "reopened") {
    return "bg-rose-50 text-rose-800 border-rose-200";
  }
  if (s === "open" || s === "in_progress") {
    return "bg-sky-50 text-sky-900 border-sky-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function priorityTone(priority: string): string {
  const p = priority.toLowerCase();
  if (p === "critical" || p === "urgent") {
    return "bg-rose-50 text-rose-800 border-rose-200";
  }
  if (p === "high") {
    return "bg-orange-50 text-orange-900 border-orange-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function StatusChip({
  code,
  map,
  tone,
}: {
  code: string;
  map: Record<string, string>;
  tone: string;
}) {
  const label = map[code] ?? map[code.toLowerCase()] ?? "—";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

export function FlashMessage({ flash }: { flash: SupportFlash | null }) {
  if (!flash) return null;
  const tone =
    flash.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : flash.tone === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-sky-200 bg-sky-50 text-sky-900";
  return (
    <p
      role={flash.tone === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2 text-sm ${tone}`}
    >
      {flash.text}
    </p>
  );
}

export function labelFor(map: Record<string, string>, code: string): string {
  return map[code] ?? map[code.toLowerCase()] ?? "—";
}

export function assigneeLabelFor(
  item: Pick<PlatformSupportTicketsListItem, "assigned_support_owner_id">,
  viewerUserId: string | null,
  labels: {
    unassigned: string;
    assignedToMe: string;
    assignedToColleague: string;
  },
): string {
  const id = item.assigned_support_owner_id;
  if (!id) return labels.unassigned;
  if (viewerUserId && id === viewerUserId) return labels.assignedToMe;
  return labels.assignedToColleague;
}

export const inputClass =
  "w-full rounded-lg border border-[color:var(--aipify-border)] bg-white px-3 py-2 text-sm text-[color:var(--aipify-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color:var(--aipify-focus-ring)]";

export const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-[color:var(--aipify-companion-purple)] px-4 text-sm font-medium text-white transition-colors hover:bg-[color:var(--aipify-companion-purple-hover)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]";

export const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg border border-[color:var(--aipify-border)] bg-white px-4 text-sm font-medium text-[color:var(--aipify-text)] transition-colors hover:bg-[color:var(--aipify-surface-muted)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]";
