const modules = [
  {
    title: "Aipify Support",
    description: "Reduce response times and handle inquiries with confidence.",
    detail:
      "Prepare high-quality replies, triage customer requests, and help teams respond thoughtfully with human oversight.",
    tag: "Customer support",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Aipify Install",
    description: "Connect your existing systems and learn your operations.",
    detail:
      "Connect your existing systems and let Aipify understand your workflows, knowledge and business structure.",
    tag: "System learning",
    highlight: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: "from-violet-500 to-violet-600",
  },
  {
    title: "Aipify Insights",
    description: "Surface trends, risks, and recommended actions.",
    detail:
      "Surface trends, risks, opportunities and recommended actions from your business data with executive-grade clarity.",
    tag: "Insights",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    title: "Aipify Commerce",
    description: "Optimize products, margins, and commerce performance.",
    detail:
      "Optimize products, margins, supplier workflows and commerce performance with permission-based recommendations.",
    tag: "Revenue",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    gradient: "from-indigo-500 to-violet-600",
  },
];

export default function Modules() {
  return (
    <section id="features" className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Core Modules
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Core Aipify modules designed to support your operations, knowledge, customers and
            growth.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((mod) => (
            <article
              key={mod.title}
              className={`group flex flex-col rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                mod.highlight
                  ? "border-violet-200 ring-1 ring-violet-100 hover:border-violet-300 hover:shadow-violet-500/10"
                  : "border-gray-200 hover:border-blue-200 hover:shadow-blue-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${mod.gradient} p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  {mod.icon}
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {mod.tag}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">{mod.title}</h3>
              <p className="mt-2 text-base font-medium leading-relaxed text-gray-700">
                {mod.description}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">{mod.detail}</p>

              {mod.highlight && (
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  Learns your systems with human validation
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
