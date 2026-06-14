type HeroProps = {
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statResponse: string;
  statResponseLabel: string;
  statModules: string;
  statModulesLabel: string;
  statAvailability: string;
  statAvailabilityLabel: string;
};

const assistantUpdates = [
  { label: "3 support inquiries prepared", color: "bg-blue-500", module: "Aipify Support" },
  { label: "1 recommended action", color: "bg-violet-500", module: "Aipify Insights" },
  { label: "2 operational insights", color: "bg-indigo-400", module: "Aipify Commerce" },
];

const connectedSystems = ["CRM", "Support", "Shop", "Analytics"];

export default function Hero({
  badge,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  statResponse,
  statResponseLabel,
  statModules,
  statModulesLabel,
  statAvailability,
  statAvailabilityLabel,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute top-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-32">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            {badge}
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            {title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            {subtitle}
          </p>

          <div id="demo" className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-violet-700"
            >
              {ctaPrimary}
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              {ctaSecondary}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-gray-100 pt-8 sm:gap-10">
            <div>
              <p className="text-2xl font-bold text-gray-900">{statResponse}</p>
              <p className="mt-1 text-sm text-gray-500">{statResponseLabel}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statModules}</p>
              <p className="mt-1 text-sm text-gray-500">{statModulesLabel}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statAvailability}</p>
              <p className="mt-1 text-sm text-gray-500">{statAvailabilityLabel}</p>
            </div>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:max-w-none">
          <div className="rounded-2xl border border-gray-200 bg-white p-1 shadow-2xl shadow-gray-200/50">
            <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-5 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-md">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-gray-900">Aipify Companion</p>
                  <p className="text-xs text-gray-500">Governance-ready operational support</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                {assistantUpdates.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-white bg-white/80 p-3 shadow-sm"
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${item.color}`} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.module}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Connected systems
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {connectedSystems.map((system) => (
                    <span
                      key={system}
                      className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
                    >
                      {system}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
