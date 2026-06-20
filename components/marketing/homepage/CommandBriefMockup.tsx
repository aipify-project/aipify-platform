import type { HomepageRedesignContent } from "@/lib/marketing/parse-homepage";

type CommandBriefMockupProps = {
  labels: HomepageRedesignContent["commandBrief"];
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

export default function CommandBriefMockup({ labels, compact = false }: CommandBriefMockupProps) {
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
          <p className="text-xs text-aipify-text-secondary">Unonight Operations · Friday morning</p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
          All systems operational
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
              <span
                key={item}
                className="rounded-lg border border-aipify-border bg-aipify-surface px-3 py-1.5 text-sm font-medium text-aipify-text"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
