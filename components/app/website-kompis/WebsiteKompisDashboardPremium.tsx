import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
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
  title,
  description,
  productName,
  statusLabel,
  statusTone,
  contextLine,
  statusExplain,
  presence,
  mascotAlt,
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
  title: string;
  description: string;
  productName: string;
  statusLabel: string;
  statusTone: "emerald" | "amber" | "slate" | "purple";
  contextLine: string | null;
  statusExplain: string;
  presence: string | null;
  mascotAlt: string;
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
  const tone =
    statusTone === "emerald"
      ? "bg-[#E9F8F0] text-[#146C43] ring-[#B7E4CF]"
      : statusTone === "amber"
        ? "bg-[#FFF4E5] text-[#945A15] ring-[#EEC58C]"
        : statusTone === "purple"
          ? "bg-[#F3EDFF] text-[#5538D3] ring-[#D3C7FF]"
          : "bg-[#F4F6FB] text-[#5F6788] ring-[#E6E9F5]";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#E4E6F2] bg-white shadow-[0_12px_32px_rgba(65,54,132,0.06)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(46%,460px)] bg-cover bg-right bg-no-repeat lg:block"
          style={{ backgroundImage: "url(/website-kompis/dashboard/kompis_hero_glow_premium_v2.png)" }}
        />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end lg:gap-10">
          <div className="relative z-10 min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-[#20243E] sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#65708A]">{description}</p>
            <div className="mt-6 max-w-xl rounded-[18px] border border-[#E4E6F2] bg-white p-4 shadow-[0_6px_18px_rgba(65,54,132,0.04)]">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-[#20243E]">{productName}</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tone}`}>
                  <span className="size-1.5 rounded-full bg-current" aria-hidden />
                  {statusLabel}
                </span>
              </div>
              {contextLine ? <p className="mt-2 text-sm text-[#65708A]">{contextLine}</p> : null}
              <p className="mt-2 text-sm leading-relaxed text-[#65708A]">{statusExplain}</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3 lg:items-end">
            {presence ? (
              <p className="max-w-[15rem] rounded-2xl rounded-br-md border border-[#E4E6F2] bg-white px-3 py-2 text-sm leading-snug text-[#20243E] shadow-[0_8px_20px_rgba(65,54,132,0.06)]">
                {presence}
              </p>
            ) : null}
            <Image
              src="/website-kompis/dashboard/kompis_mascot_premium_v2.png"
              alt={mascotAlt}
              width={320}
              height={320}
              className="h-36 w-auto object-contain sm:h-44 lg:h-52"
            />
          </div>
        </div>
      </section>

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
