type AiInsightListProps = {
  title: string;
  items: string[];
};

export default function AiInsightList({ title, items }: AiInsightListProps) {
  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl bg-white/80 px-4 py-3 text-sm leading-relaxed text-gray-700 ring-1 ring-violet-100"
          >
            <span className="mt-0.5 shrink-0 text-violet-500" aria-hidden="true">
              ✦
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
