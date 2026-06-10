const placeholders = [
  { name: "Acme Corp", initials: "AC", color: "from-blue-400 to-blue-600" },
  { name: "Northline", initials: "NL", color: "from-violet-400 to-violet-600" },
  { name: "Brightfield", initials: "BF", color: "from-indigo-400 to-indigo-600" },
  { name: "Meridian", initials: "ME", color: "from-blue-500 to-indigo-500" },
  { name: "Cloudbase", initials: "CB", color: "from-violet-500 to-purple-600" },
  { name: "Vertex", initials: "VX", color: "from-blue-600 to-violet-600" },
];

export default function SocialProof() {
  return (
    <section className="border-y border-gray-200 bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
          Trusted by growing businesses.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {placeholders.map((company) => (
            <div
              key={company.name}
              className="flex h-16 items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 transition hover:border-gray-300 hover:shadow-sm sm:h-[4.5rem] sm:px-4"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${company.color} text-xs font-bold text-white`}
                aria-hidden="true"
              >
                {company.initials}
              </span>
              <span className="truncate text-xs font-semibold text-gray-400 sm:text-sm">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
