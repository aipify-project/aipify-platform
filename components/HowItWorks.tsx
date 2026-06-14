const steps = [
  {
    number: "01",
    title: "Connect your organization.",
    description:
      "Link your systems, knowledge sources and workflows. Aipify begins understanding the tools your business already uses.",
    systems: ["CRM", "Support", "Knowledge", "Commerce"],
  },
  {
    number: "02",
    title: "Aipify learns your operations.",
    description:
      "Aipify studies workflows, support patterns, policies, team structures and business rules.",
    systems: ["Workflows", "Policies", "Teams", "Business rules"],
  },
  {
    number: "03",
    title: "Aipify supports your teams.",
    description:
      "Aipify prepares summaries, recommendations, replies, reports and approved workflow actions.",
    systems: ["Aipify Support", "Aipify Insights", "Aipify Commerce", "Aipify Install"],
  },
  {
    number: "04",
    title: "Gain executive insight.",
    description:
      "Aipify surfaces priorities, risks, opportunities and health indicators across your organization.",
    systems: ["Executive view", "Health scores", "Risk signals", "Recommendations"],
  },
  {
    number: "05",
    title: "Scale with confidence.",
    description:
      "Add modules, permissions, automations and governance as your organization grows.",
    systems: ["Modules", "Permissions", "Governance", "Audit-ready workflows"],
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
            From setup to operational value in a guided onboarding flow.
          </p>
        </div>

        <div className="relative mt-16 hidden lg:block">
          <div
            className="absolute left-[10%] right-[10%] top-8 h-px bg-gradient-to-r from-blue-300 via-violet-400 to-blue-300"
            aria-hidden="true"
          />
          <div className="grid grid-cols-5 gap-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-blue-500/25">
                  {step.number}
                </div>
                <h3 className="mt-5 text-sm font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{step.description}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {step.systems.map((system) => (
                    <span
                      key={system}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                    >
                      {system}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-3xl lg:hidden">
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
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-600">{step.description}</p>
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
