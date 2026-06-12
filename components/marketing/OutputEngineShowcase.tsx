type OutputEngineShowcaseProps = {
  title: string;
  subtitle: string;
  items: string[];
};

export default function OutputEngineShowcase({
  title,
  subtitle,
  items,
}: OutputEngineShowcaseProps) {
  return (
    <section className="border-y border-white/10 bg-[#0c1018]" aria-labelledby="outputs-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="outputs-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-slate-400">{subtitle}</p>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-xs font-bold text-cyan-300">
                {i + 1}
              </span>
              <span className="text-sm text-slate-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
