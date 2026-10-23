import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type Metric = {
  label: string;
  hint: string;
  value: number;
  icon: LucideIcon;
  chip: string;
  wash: string;
};

type Action = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  emphasis?: boolean;
};

type Signal = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export function WebsiteKompisDashboardPremium({
  knowledgeTitle,
  knowledgeDescription,
  knowledgeMetrics,
  knowledgeNote,
  qualityTitle,
  qualityDescription,
  qualityMetrics,
  connectionTitle,
  connectionSignals,
  manageConnectionLabel,
  manageConnectionHref,
  primaryActions,
  secondaryActions,
  operatorHref,
  operatorLabel,
}: {
  knowledgeTitle: string;
  knowledgeDescription: string;
  knowledgeMetrics: Metric[] | null;
  knowledgeNote: string | null;
  qualityTitle: string;
  qualityDescription: string;
  qualityMetrics: Metric[] | null;
  connectionTitle: string;
  connectionSignals: Signal[];
  manageConnectionLabel: string;
  manageConnectionHref: string;
  primaryActions: Action[];
  secondaryActions: Action[];
  operatorHref: string;
  operatorLabel: string;
}) {
  return (
    <div className="space-y-8">
      {knowledgeMetrics ? (
        <MetricSection
          id="wk-knowledge-status"
          title={knowledgeTitle}
          description={knowledgeDescription}
          metrics={knowledgeMetrics}
          note={knowledgeNote}
        />
      ) : null}

      {qualityMetrics ? (
        <MetricSection
          id="wk-quality-signals"
          title={qualityTitle}
          description={qualityDescription}
          metrics={qualityMetrics}
          note={null}
        />
      ) : null}

      <section
        className="flex flex-col gap-4 rounded-[20px] border border-[#E4E6F2] bg-white p-5 shadow-[0_8px_22px_rgba(65,54,132,0.05)] sm:flex-row sm:items-center sm:justify-between"
        aria-labelledby="wk-connection-status"
      >
        <div className="min-w-0">
          <h2 id="wk-connection-status" className="text-lg font-semibold text-[#20243E]">
            {connectionTitle}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {connectionSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <li
                  key={signal.label}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F7F6FB] px-3 text-sm text-[#20243E] ring-1 ring-[#E4E6F2]"
                >
                  <Icon aria-hidden className="size-4 text-[#7055EE]" strokeWidth={2} />
                  <span className="text-[#65708A]">{signal.label}</span>
                  <span className="font-medium">{signal.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <Link
          href={manageConnectionHref}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[image:var(--app-primary-gradient)] px-4 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
        >
          {manageConnectionLabel}
        </Link>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        {primaryActions.map((action) => (
          <ActionCard key={action.href + action.title} action={action} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {secondaryActions.map((action, index) => (
          <div
            key={action.href + action.title}
            className={
              secondaryActions.length === 5
                ? index < 3
                  ? "h-full lg:col-span-2"
                  : index === secondaryActions.length - 1
                    ? "h-full sm:col-span-2 lg:col-span-3"
                    : "h-full lg:col-span-3"
                : "h-full lg:col-span-2"
            }
          >
            <ActionCard action={action} />
          </div>
        ))}
      </div>
      <p className="text-sm text-[#65708A]">
        <Link
          href={operatorHref}
          className="inline-flex min-h-11 items-center rounded font-medium text-[#6847F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
        >
          {operatorLabel}
        </Link>
      </p>
    </div>
  );
}

function MetricSection({
  id,
  title,
  description,
  metrics,
  note,
}: {
  id: string;
  title: string;
  description: string;
  metrics: Metric[];
  note: string | null;
}) {
  const columns = metrics.length === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-4";
  return (
    <section className="space-y-4" aria-labelledby={id}>
      <div>
        <h2 id={id} className="text-lg font-semibold text-[#20243E]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-[#65708A]">{description}</p>
      </div>
      <div className={`grid gap-4 ${columns}`}>
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`flex h-full flex-col rounded-[18px] border border-[#E4E6F2] p-5 shadow-[0_8px_22px_rgba(65,54,132,0.045)] ${metric.wash}`}
            >
              <span className={`inline-flex size-11 items-center justify-center rounded-2xl ${metric.chip}`}>
                <Icon aria-hidden className="size-5" strokeWidth={2} />
              </span>
              <p className="mt-4 text-sm font-medium text-[#65708A]">{metric.label}</p>
              <p className="mt-1 text-[1.85rem] font-semibold tabular-nums tracking-tight text-[#20243E]">{metric.value}</p>
              <p className="mt-1 text-sm leading-snug text-[#65708A]">{metric.hint}</p>
            </div>
          );
        })}
      </div>
      {note ? <p className="text-sm leading-relaxed text-[#65708A]">{note}</p> : null}
    </section>
  );
}

function ActionCard({ action }: { action: Action }) {
  const Icon = action.icon;
  return (
    <Link
      href={action.href}
      className={`group flex h-full min-h-28 flex-col justify-between rounded-[18px] border p-5 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] ${
        action.emphasis
          ? "border-transparent bg-[#7055EE] text-white shadow-[0_14px_32px_rgba(112,85,238,0.22)] hover:shadow-[0_16px_36px_rgba(112,85,238,0.28)]"
          : "border-[#E4E6F2] bg-white text-[#20243E] shadow-[0_8px_22px_rgba(65,54,132,0.045)] hover:shadow-[0_12px_28px_rgba(65,54,132,0.08)]"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex size-11 items-center justify-center rounded-2xl ${
            action.emphasis ? "bg-white/15 text-white" : "bg-[#F3EDFF] text-[#7055EE]"
          }`}
        >
          <Icon aria-hidden className="size-5" strokeWidth={2} />
        </span>
        <ArrowUpRight aria-hidden className={`size-4 ${action.emphasis ? "text-white/80" : "text-[#7055EE]"}`} />
      </span>
      <span className="mt-4 block text-base font-semibold">{action.title}</span>
      <span className={`mt-1 block text-sm leading-snug ${action.emphasis ? "text-white/85" : "text-[#65708A]"}`}>
        {action.description}
      </span>
    </Link>
  );
}
