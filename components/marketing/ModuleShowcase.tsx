type ModuleItem = { name: string; description: string };

type ModuleShowcaseProps = {
  title: string;
  subtitle: string;
  modules: ModuleItem[];
};

const MODULE_ACCENTS = [
  "group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10",
  "group-hover:border-blue-500/40 group-hover:shadow-blue-500/10",
  "group-hover:border-violet-500/40 group-hover:shadow-violet-500/10",
  "group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/10",
  "group-hover:border-teal-500/40 group-hover:shadow-teal-500/10",
];

export default function ModuleShowcase({ title, subtitle, modules }: ModuleShowcaseProps) {
  return (
    <section id="modules" className="scroll-mt-20 border-y border-aipify-border bg-aipify-surface-muted/60" aria-labelledby="modules-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="modules-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {modules.map((mod, i) => (
            <li
              key={mod.name}
              className={`group rounded-2xl border border-aipify-border bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-lg ${MODULE_ACCENTS[i % MODULE_ACCENTS.length]}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-600/20 text-sm font-bold text-cyan-300 transition group-hover:from-cyan-500/30 group-hover:to-violet-600/30">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-base font-semibold text-aipify-text">{mod.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{mod.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
