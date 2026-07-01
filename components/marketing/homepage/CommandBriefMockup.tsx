import type { CommandBriefMockupLabels } from "@/lib/marketing/parse-homepage";

type CommandBriefMockupProps = {
  labels: CommandBriefMockupLabels;
  variant?: "hero" | "default";
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
      ? "text-amber-800"
      : accent === "success"
        ? "text-emerald-800"
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
  if (/pending|attention|review/i.test(item)) return "attention";
  if (/active|healthy|operational|updated|sync/i.test(item)) return "success";
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

export default function CommandBriefMockup({ labels, variant = "default", compact = false }: CommandBriefMockupProps) {
  const isHero = variant === "hero";
  const organization = labels.panelOrganization ?? "Operations team";
  const context = labels.panelContext ?? "Monday morning";
  const badge = labels.headerBadge ?? "Systems operational";

  return (
    <figure className="m-0">
      {labels.illustrativeLabel ? (
        <figcaption className="mb-2 text-right text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
          {labels.illustrativeLabel}
        </figcaption>
      ) : null}
      <div
        className={`overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg shadow-slate-900/5 ${
          isHero ? "ring-1 ring-aipify-border/80" : compact ? "shadow-md" : ""
        }`}
        role="img"
        aria-label={labels.panelTitle}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-aipify-border bg-aipify-surface-muted/80 px-5 py-4">
          <div>
            <p className={`font-semibold text-aipify-text ${isHero ? "text-base" : "text-sm"}`}>{labels.panelTitle}</p>
            <p className="text-xs text-aipify-text-secondary">
              {organization} · {context}
            </p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
            {badge}
          </span>
        </div>

        <div className={`grid gap-4 p-5 ${isHero ? "md:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"}`}>
          <BriefColumn title={labels.sinceLastLogin} items={labels.sinceItems} />
          <BriefColumn title={labels.aipifyCompleted} items={labels.completedItems} accent="success" />
          <BriefColumn title={labels.needsAttention} items={labels.attentionItems} accent="attention" />
          <BriefColumn title={labels.recommendedActions} items={labels.actionItems} />
          <div className={`rounded-xl border border-aipify-border bg-aipify-accent-soft/40 p-4 ${isHero ? "md:col-span-2 xl:col-span-3" : "sm:col-span-2 xl:col-span-2"}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-aipify-accent">{labels.organizationStatus}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {labels.statusItems.map((item) => (
                <StatusBadge key={item} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
