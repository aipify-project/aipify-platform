export type HowItWorksStep = {
  number: string;
  title: string;
  description: string;
  enterpriseNote: string;
};

type HowItWorksProps = {
  title: string;
  subtitle: string;
  steps: HowItWorksStep[];
};

export default function HowItWorks({ title, subtitle, steps }: HowItWorksProps) {
  return (
    <section id="solutions" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">{subtitle}</p>
        </div>

        <ol className="mx-auto mt-16 max-w-4xl space-y-6 sm:mt-20 sm:space-y-8">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10 lg:p-12"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
                <p
                  className="shrink-0 text-5xl font-bold tracking-tight text-gray-200 sm:text-6xl"
                  aria-hidden="true"
                >
                  {step.number}
                </p>
                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                    {step.description}
                  </p>
                  <p className="mt-6 border-l-2 border-violet-200 pl-4 text-sm leading-relaxed text-gray-500 sm:text-base">
                    {step.enterpriseNote}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
