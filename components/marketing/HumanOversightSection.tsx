type LadderStep = { label: string; description: string };

type HumanOversightSectionProps = {
  title: string;
  subtitle: string;
  ladder: LadderStep[];
};

const LADDER_COLORS = [
  "border-slate-500/30 bg-slate-500/10",
  "border-cyan-500/30 bg-cyan-500/10",
  "border-violet-500/30 bg-violet-500/10",
  "border-amber-500/30 bg-amber-500/10",
];

export default function HumanOversightSection({
  title,
  subtitle,
  ladder,
}: HumanOversightSectionProps) {
  return (
    <section aria-labelledby="human-oversight-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="human-oversight-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-slate-400">{subtitle}</p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="relative space-y-4">
            {ladder.map((step, i) => (
              <div
                key={step.label}
                className={`relative rounded-2xl border p-6 ${LADDER_COLORS[i % LADDER_COLORS.length]}`}
                style={{ marginLeft: `${i * 12}px`, marginRight: `${(ladder.length - 1 - i) * 12}px` }}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.label}</h3>
                    <p className="mt-1 text-sm text-slate-400">{step.description}</p>
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
