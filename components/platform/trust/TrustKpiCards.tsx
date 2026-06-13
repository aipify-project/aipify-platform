type KpiItem = {
  label: string;
  value: string;
  hint?: string;
};

type Props = {
  items: KpiItem[];
};

export function TrustKpiCards({ items }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">{item.value}</p>
          {item.hint ? <p className="mt-1 text-xs text-gray-500">{item.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
