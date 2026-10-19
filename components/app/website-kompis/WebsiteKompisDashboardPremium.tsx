import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Metric = {
  label: string;
  hint: string;
  value: number;
  icon: LucideIcon;
  chip: string;
};

type Action = {
  href: string;
  title: string;
  description: string;
  emphasis?: boolean;
};

type Signal = {
  label: string;
  value: string;
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
        ? "bg-[#FFF3DF] text-[#8A5A10] ring-[#F5D4A3]"
        : statusTone === "purple"
          ? "bg-[#F3EDFF] text-[#5538D3] ring-[#D3C7FF]"
          : "bg-[#F4F6FB] text-[#5F6788] ring-[#E6E9F5]";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#E6E9F5] bg-white shadow-[0_16px_40px_rgba(84,66,190,0.10)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[min(52%,520px)] bg-cover bg-right bg-no-repeat opacity-80"
          style={{ backgroundImage: "url(/website-kompis/dashboard/kompis_hero_glow_premium_v2.png)" }}
        />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,340px)] lg:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#181A3A] sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#5F6788]">{description}</p>
            <div className="mt-6 rounded-[20px] border border-[#E6E9F5] bg-white/90 p-4 shadow-[0_8px_24px_rgba(84,66,190,0.08)]">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-[#181A3A]">{productName}</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tone}`}>
                  <span className="size-1.5 rounded-full bg-current" aria-hidden />
                  {statusLabel}
                </span>
              </div>
              {contextLine ? <p className="mt-2 text-sm text-[#5F6788]">{contextLine}</p> : null}
              <p className="mt-2 text-sm leading-relaxed text-[#5F6788]">{statusExplain}</p>
            </div>
          </div>
          <div className="relative flex min-h-40 items-end justify-center lg:justify-end">
            {presence ? (
              <p className="absolute left-0 top-0 max-w-[14rem] rounded-2xl rounded-br-md border border-[#E6E9F5] bg-white px-3 py-2 text-sm text-[#181A3A] shadow-[0_8px_24px_rgba(84,66,190,0.08)]">
                {presence}
              </p>
            ) : null}
            <Image
              src="/website-kompis/dashboard/kompis_mascot_premium_v2.png"
              alt={mascotAlt}
              width={320}
              height={320}
              className="h-40 w-auto object-contain sm:h-48"
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

      <section className="flex flex-col gap-4 rounded-[20px] border border-[#E6E9F5] bg-white p-5 shadow-[0_8px_24px_rgba(84,66,190,0.08)] sm:flex-row sm:items-center sm:justify-between" aria-labelledby="wk-connection-status">
        <div>
          <h2 id="wk-connection-status" className="text-lg font-semibold text-[#181A3A]">{connectionTitle}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {connectionSignals.map((signal) => (
              <span key={signal.label} className="inline-flex items-center gap-2 rounded-full bg-[#F6F7FC] px-3 py-1.5 text-sm text-[#181A3A] ring-1 ring-[#E6E9F5]">
                <span className="text-[#5F6788]">{signal.label}</span>
                <span className="font-medium">{signal.value}</span>
              </span>
            ))}
          </div>
        </div>
        <Link
          href={manageConnectionHref}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[image:var(--app-primary-gradient)] px-4 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8]"
        >
          {manageConnectionLabel}
        </Link>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
        {primaryActions.map((action) => (
          <ActionCard key={action.href + action.title} action={action} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {secondaryActions.map((action) => (
          <ActionCard key={action.href + action.title} action={action} />
        ))}
      </div>
      <p className="text-sm text-[#5F6788]">
        <Link href={operatorHref} className="font-medium text-[#6847F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] rounded">
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
  return (
    <section className="space-y-3" aria-labelledby={id}>
      <div>
        <h2 id={id} className="text-lg font-semibold text-[#181A3A]">{title}</h2>
        <p className="mt-1 text-sm text-[#5F6788]">{description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-[20px] border border-[#E6E9F5] bg-white p-4 shadow-[0_8px_24px_rgba(84,66,190,0.06)]">
              <span className={`inline-flex size-9 items-center justify-center rounded-xl ${metric.chip}`}>
                <Icon aria-hidden className="size-4" strokeWidth={2} />
              </span>
              <p className="mt-4 text-3xl font-semibold tabular-nums tracking-tight text-[#181A3A]">{metric.value}</p>
              <p className="mt-1 text-sm font-medium text-[#181A3A]">{metric.label}</p>
              <p className="mt-1 text-xs text-[#8A92B2]">{metric.hint}</p>
            </div>
          );
        })}
      </div>
      {note ? <p className="text-sm text-[#5F6788]">{note}</p> : null}
    </section>
  );
}

function ActionCard({ action }: { action: Action }) {
  return (
    <Link
      href={action.href}
      className={`flex min-h-28 flex-col justify-between rounded-[20px] border p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] ${
        action.emphasis
          ? "border-transparent bg-[image:var(--app-primary-gradient)] text-white shadow-[0_16px_40px_rgba(84,66,190,0.16)]"
          : "border-[#E6E9F5] bg-white text-[#181A3A] shadow-[0_8px_24px_rgba(84,66,190,0.06)]"
      }`}
    >
      <span className="text-base font-semibold">{action.title}</span>
      <span className={`mt-2 text-sm ${action.emphasis ? "text-white/85" : "text-[#5F6788]"}`}>{action.description}</span>
    </Link>
  );
}
