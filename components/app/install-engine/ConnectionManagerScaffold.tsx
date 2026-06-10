type ConnectionManagerScaffoldProps = {
  title: string;
  subtitle: string;
  areas: string[];
};

/** Customer App — connected systems and sync status (Layer 2). */
export function ConnectionManagerScaffold({
  title,
  subtitle,
  areas,
}: ConnectionManagerScaffoldProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {areas.map((area) => (
          <li
            key={area}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
          >
            {area}
          </li>
        ))}
      </ul>
    </div>
  );
}
