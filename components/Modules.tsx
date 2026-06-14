type ModuleItem = {
  title: string;
  description: string;
  detail: string;
  highlight?: boolean;
  highlightLabel?: string;
  icon: React.ReactNode;
  gradient: string;
};

type ModulesProps = {
  title: string;
  subtitle: string;
  modules: ModuleItem[];
};

export default function Modules({ title, subtitle, modules }: ModulesProps) {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">{subtitle}</p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((mod) => (
            <article
              key={mod.title}
              className={`group flex flex-col rounded-2xl border bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                mod.highlight
                  ? "border-violet-200 ring-1 ring-violet-100 hover:border-violet-300 hover:shadow-violet-500/10"
                  : "border-gray-200 hover:border-blue-200 hover:shadow-blue-500/5"
              }`}
            >
              <div
                className={`inline-flex w-fit rounded-xl bg-gradient-to-br ${mod.gradient} p-3.5 text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}
              >
                {mod.icon}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900 sm:text-2xl">{mod.title}</h3>
              <p className="mt-3 text-base font-medium leading-relaxed text-gray-800">
                {mod.description}
              </p>
              <p className="mt-4 flex-1 text-base leading-relaxed text-gray-600">{mod.detail}</p>

              {mod.highlight && mod.highlightLabel ? (
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-violet-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden="true" />
                  {mod.highlightLabel}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
