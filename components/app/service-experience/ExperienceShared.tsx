export function ExperienceStatGrid({
  items,
}: {
  items: { label: string; value: string | number }[];
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{item.label}</dt>
          <dd className="mt-2 text-2xl font-semibold text-zinc-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ExperienceItemList({
  rows,
  emptyLabel,
}: {
  rows: Record<string, unknown>[];
  emptyLabel: string;
}) {
  if (rows.length === 0) return <p className="text-sm text-zinc-600">{emptyLabel}</p>;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {rows.map((item) => (
        <div key={String(item.record_key ?? item.record_title)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-zinc-900">{String(item.record_title ?? item.customer_label ?? "Record")}</p>
          {item.status_label ? <p className="mt-1 text-xs text-zinc-600">{String(item.status_label)}</p> : null}
          {item.summary ? <p className="mt-2 text-sm text-zinc-600">{String(item.summary)}</p> : null}
        </div>
      ))}
    </div>
  );
}
