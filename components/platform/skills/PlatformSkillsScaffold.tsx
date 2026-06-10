type PlatformSkillsScaffoldProps = {
  title: string;
  subtitle: string;
  areas: string[];
  registryLabel?: string;
  registryStats?: string;
};

/** Scaffold for Platform Admin skill governance (Layer 1). */
export function PlatformSkillsScaffold({
  title,
  subtitle,
  areas,
  registryLabel,
  registryStats,
}: PlatformSkillsScaffoldProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        {registryLabel && registryStats ? (
          <p className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-sm text-indigo-900">
            <span className="font-medium">{registryLabel}:</span> {registryStats}
          </p>
        ) : null}
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
