type AssistantPanelProps = {
  title: string;
  online: string;
  sinceLogin: string;
  items: string[];
  viewSummary: string;
  askAipify: string;
};

export default function AssistantPanel({
  title,
  online,
  sinceLogin,
  items,
  viewSummary,
  askAipify,
}: AssistantPanelProps) {
  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-blue-50/50 p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-md">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="relative mt-0.5 inline-flex items-center gap-1.5 text-xs text-gray-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {online}
          </span>
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-gray-900">{sinceLogin}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-600"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-violet-700"
        >
          {viewSummary}
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          {askAipify}
        </button>
      </div>
    </section>
  );
}
