const assistantUpdates = [
  { label: "3 supporthenvendelser besvart", color: "bg-blue-500", module: "Support AI" },
  { label: "1 anbefalt handling", color: "bg-violet-500", module: "Analytics AI" },
  { label: "2 nye innsikter", color: "bg-indigo-400", module: "Commerce AI" },
];

const connectedSystems = ["CRM", "Support", "Shop", "Analytics"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute top-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-32">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            AI Platform for Business
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Aipify works for you.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Aipify helps businesses automate support, streamline operations and
            make smarter decisions through intelligent AI assistants.
          </p>

          <p className="mt-4 max-w-xl text-base text-gray-500">
            Connect your systems once — Aipify learns how your business works
            and starts helping your team from day one.
          </p>

          <div id="demo" className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-violet-700"
            >
              Get Started
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              Book a Demo
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-gray-100 pt-8">
            <div>
              <p className="text-2xl font-bold text-gray-900">2 min</p>
              <p className="text-sm text-gray-500">Avg. response time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-sm text-gray-500">AI modules included</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">24/7</p>
              <p className="text-sm text-gray-500">Assistant availability</p>
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
                  <p className="text-base font-semibold text-gray-900">Aipify Assistant</p>
                  <p className="text-xs text-gray-500">Always learning, always helping</p>
                </div>
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
              </div>

              <div className="mb-4 rounded-xl border border-violet-100 bg-violet-50/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                  Learning from your systems
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {connectedSystems.map((system) => (
                    <span
                      key={system}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      {system}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Install AI — system knowledge</span>
                    <span className="font-medium text-violet-700">78%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-violet-100">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-gray-900">Siden sist:</p>
                  <ul className="mt-3 space-y-3">
                    {assistantUpdates.map((item) => (
                      <li key={item.label} className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${item.color}`} />
                          {item.label}
                        </div>
                        <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {item.module}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
                  <div className="h-9 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs leading-9 text-gray-400">
                    Ask Aipify anything...
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-violet-600">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg sm:-left-4">
            <p className="text-xs font-medium text-gray-500">Response time</p>
            <p className="text-lg font-bold text-gray-900">2 min</p>
          </div>

          <div className="absolute -right-2 -top-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg sm:-right-3">
            <p className="text-xs font-medium text-gray-500">Tasks automated</p>
            <p className="text-lg font-bold text-gray-900">847</p>
          </div>
        </div>
      </div>
    </section>
  );
}
