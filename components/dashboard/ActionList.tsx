type ActionListProps = {
  title: string;
  items: string[];
};

export default function ActionList({ title, items }: ActionListProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <ul className="mt-5 divide-y divide-gray-100">
        {items.map((item, index) => (
          <li key={item}>
            <button
              type="button"
              className="group flex w-full items-center justify-between gap-4 py-4 text-left transition hover:text-violet-700"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-500 transition group-hover:bg-violet-100 group-hover:text-violet-700">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-violet-700">
                  {item}
                </span>
              </div>
              <svg
                className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-violet-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
