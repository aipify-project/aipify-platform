type WorkStep = { title: string; description: string };

type HowAipifyWorksSectionProps = {
  title: string;
  subtitle: string;
  steps: WorkStep[];
};

export default function HowAipifyWorksSection({
  title,
  subtitle,
  steps,
}: HowAipifyWorksSectionProps) {
  return (
    <section id="how-it-works" className="scroll-mt-20" aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="how-it-works-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-slate-400">{subtitle}</p>
        </div>

        <ol className="relative mt-14 space-y-8 lg:space-y-0">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-transparent lg:left-1/2 lg:block" aria-hidden="true" />

          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`relative flex flex-col gap-4 lg:flex-row lg:items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:w-1/2 lg:px-8">
                <div
                  className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${
                    i % 2 === 0 ? "lg:text-right" : ""
                  }`}
                >
                  <span className="text-sm font-semibold text-cyan-400">Step {i + 1}</span>
                  <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                </div>
              </div>

              <div className="absolute left-4 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400 lg:left-1/2 lg:block" aria-hidden="true" />

              <div className="hidden lg:block lg:w-1/2" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
