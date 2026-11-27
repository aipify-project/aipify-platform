import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";
import type { PlatformTrafficStatus, TrafficCount } from "@/lib/platform-portal/traffic-status";

export type PlatformTrafficStatusLabels = {
  region: string;
  operational: string;
  operationalHint: string;
  newAppCustomers: string;
  newAppCustomersHint: string;
  newSellers: string;
  newSellersHint: string;
  appCustomersOnline: string;
  sellersOnline: string;
  signedInUsers: string;
  visitors: string;
  notMeasured: string;
  notMeasuredHint: string;
  unavailable: string;
  dayScope: string;
  lastChecked: string;
};

type PlatformTrafficStatusBarProps = {
  status: PlatformTrafficStatus;
  labels: PlatformTrafficStatusLabels;
  locale: string;
};

function displayValue(count: TrafficCount, labels: PlatformTrafficStatusLabels): string {
  if (count.state === "value") return String(count.value);
  return count.reason === "not_measured" ? labels.notMeasured : labels.unavailable;
}

function MetricIcon({ path }: { path: string }) {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
  );
}

function MetricCard({
  label,
  hint,
  value,
  iconPath,
}: {
  label: string;
  hint: string;
  value: string;
  iconPath: string;
}) {
  return (
    <div
      className="flex h-full min-h-[4.75rem] flex-col justify-center rounded-xl border border-[color:var(--aipify-border)] bg-white px-3 py-2 shadow-sm"
      title={hint}
    >
      <p className="flex items-start gap-1.5 text-xs leading-snug text-[color:var(--aipify-text-secondary)]">
        <MetricIcon path={iconPath} />
        <span>{label}</span>
      </p>
      <p className="mt-1 text-lg font-semibold leading-none text-[color:var(--aipify-text)]">{value}</p>
      <p className="sr-only">{hint}</p>
    </div>
  );
}

export function PlatformTrafficStatusBar({
  status,
  labels,
  locale,
}: PlatformTrafficStatusBarProps) {
  const checked = formatPlatformDateTimeShort(status.checkedAt, {
    locale,
    emptyFallback: labels.unavailable,
    invalidFallback: labels.unavailable,
  });
  const cards = [
    {
      label: labels.newAppCustomers,
      hint: labels.newAppCustomersHint,
      count: status.newAppCustomersToday,
      iconPath: "M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 8a7 7 0 1 1 14 0H3Z",
    },
    {
      label: labels.newSellers,
      hint: labels.newSellersHint,
      count: status.newSellersToday,
      iconPath: "M4 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12H4V4Zm2 2v2h8V6H6Zm0 4v2h5v-2H6Z",
    },
    {
      label: labels.appCustomersOnline,
      hint: labels.notMeasuredHint,
      count: status.appCustomersOnline,
      iconPath: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4v4.2l2.4 1.4-.8 1.3L9 11V6h2Z",
    },
    {
      label: labels.sellersOnline,
      hint: labels.notMeasuredHint,
      count: status.sellersOnline,
      iconPath: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4v4.2l2.4 1.4-.8 1.3L9 11V6h2Z",
    },
    {
      label: labels.signedInUsers,
      hint: labels.notMeasuredHint,
      count: status.signedInUsers,
      iconPath: "M7 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-3 9a6 6 0 1 1 12 0H4Z",
    },
    {
      label: labels.visitors,
      hint: labels.notMeasuredHint,
      count: status.visitorsToday,
      iconPath: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-1 3h2v2h2.5L10 12 6.5 7H9V5Z",
    },
  ];

  return (
    <section aria-label={labels.region} className="w-full space-y-2">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch">
        <div
          className="inline-flex w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-950 xl:w-auto xl:shrink-0"
          title={labels.operationalHint}
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          <span>{labels.operational}</span>
          <span className="sr-only">{labels.operationalHint}</span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {cards.map((card) => (
            <MetricCard
              key={card.label}
              label={card.label}
              hint={card.hint}
              value={displayValue(card.count, labels)}
              iconPath={card.iconPath}
            />
          ))}
        </div>
      </div>
      <p className="text-xs leading-relaxed text-[color:var(--aipify-text-secondary)]">
        {labels.operationalHint}
        {" · "}
        {labels.dayScope.replace("{zone}", status.dayTimeZone)}
        {" · "}
        {labels.lastChecked}: {checked}
      </p>
    </section>
  );
}
