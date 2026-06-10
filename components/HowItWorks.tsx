const steps = [
  {
    number: "01",
    title: "Connect your business.",
    description:
      "Link your tools, data sources and workflows in minutes. Aipify integrates with the systems you already use.",
    systems: ["CRM", "Support desk", "E-commerce", "Analytics"],
  },
  {
    number: "02",
    title: "Aipify learns your workflows.",
    description:
      "Install AI studies how your team operates — understanding patterns, priorities and the way work gets done across your connected systems.",
    systems: ["Processes", "Data flows", "Team habits", "Business rules"],
  },
  {
    number: "03",
    title: "Aipify starts helping your team.",
    description:
      "Aipify Assistant takes action — answering support, surfacing insights and recommending next steps through Support, Analytics and Commerce AI.",
    systems: ["Support AI", "Analytics AI", "Commerce AI", "Install AI"],
  },
];

export default function HowItWorks() {
  return (
    <section id="solutions" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            From setup to impact in three simple steps.
          </p>
        </div>

        {/* Desktop & tablet horizontal timeline */}
        <div className="relative mt-16 hidden md:block">
          <div
            className="absolute left-[16.67%] right-[16.67%] top-8 h-px bg-gradient-to-r from-blue-300 via-violet-400 to-blue-300"
            aria-hidden="true"
          />
          <div className="grid grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-bold text-white shadow-lg shadow-blue-500/25">
                  {step.number}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 lg:text-xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 lg:text-base">
                  {step.description}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {step.systems.map((system) => (
                    <span
                      key={system}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600"
                    >
                      {system}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="relative mx-auto mt-12 max-w-3xl md:hidden">
          <div
            className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-blue-500 via-violet-500 to-blue-300"
            aria-hidden="true"
          />
          <div className="space-y-10">
            {steps.map((step) => (
              <div key={step.number} className="relative flex gap-6">
                <div className="relative z-10 flex shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-bold text-white shadow-lg shadow-blue-500/25">
                    {step.number}
                  </div>
                </div>
                <div className="pb-2 pt-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.systems.map((system) => (
                      <span
                        key={system}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600"
                      >
                        {system}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
