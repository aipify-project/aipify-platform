import type { HomepageRedesignContent, CommandBriefMockupLabels } from "@/lib/marketing/parse-homepage";

type CommandBriefMockupProps = {
  labels: CommandBriefMockupLabels;
  compact?: boolean;
};

function BriefColumn({
  title,
  items,
  accent = "default",
}: {
  title: string;
  items: string[];
  accent?: "default" | "attention" | "success";
}) {
  const titleClass =
    accent === "attention"
      ? "text-amber-700"
      : accent === "success"
        ? "text-emerald-700"
        : "text-aipify-companion";

  return (
    <div className="rounded-xl border border-aipify-border bg-aipify-surface p-4">
      <p className={`text-xs font-semibold uppercase tracking-wide ${titleClass}`}>{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-snug text-aipify-text">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                accent === "attention" ? "bg-amber-500" : accent === "success" ? "bg-emerald-500" : "bg-aipify-companion"
              }`}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function statusTone(item: string): "success" | "attention" | "default" {
  if (/^[⚠️]|^⚠|pending|attention|review/i.test(item)) return "attention";
  if (/^[✅]|^✓|active|healthy|operational|updated|sync/i.test(item)) return "success";
  return "default";
}

function StatusBadge({ item }: { item: string }) {
  const tone = statusTone(item);
  const className =
    tone === "attention"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-aipify-border bg-aipify-surface text-aipify-text";

  return (
    <span className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${className}`}>{item}</span>
  );
}

export default function CommandBriefMockup({ labels, compact = false }: CommandBriefMockupProps) {
  const organization = labels.panelOrganization ?? "Unonight Operations";
  const context = labels.panelContext ?? "Friday morning";
  const badge = labels.headerBadge ?? "All systems operational";

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg shadow-slate-900/5 ${
        compact ? "" : "ring-1 ring-aipify-border/80"
      }`}
      role="img"
      aria-label={labels.panelTitle}
    >
      <div className="flex items-center justify-between border-b border-aipify-border bg-aipify-surface-muted/80 px-5 py-3.5">
        <div>
          <p className="text-sm font-semibold text-aipify-text">{labels.panelTitle}</p>
          <p className="text-xs text-aipify-text-secondary">
            {organization} · {context}
          </p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
          {badge}
        </span>
      </div>

      <div className={`grid gap-4 p-5 ${compact ? "sm:grid-cols-2" : "lg:grid-cols-2 xl:grid-cols-3"}`}>
        <BriefColumn title={labels.sinceLastLogin} items={labels.sinceItems} />
        <BriefColumn title={labels.aipifyCompleted} items={labels.completedItems} accent="success" />
        <BriefColumn title={labels.needsAttention} items={labels.attentionItems} accent="attention" />
        <BriefColumn title={labels.recommendedActions} items={labels.actionItems} />
        <div className={`rounded-xl border border-aipify-border bg-aipify-accent-soft/40 p-4 ${compact ? "sm:col-span-2" : "lg:col-span-2 xl:col-span-2"}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-aipify-accent">{labels.organizationStatus}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {labels.statusItems.map((item) => (
              <StatusBadge key={item} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
