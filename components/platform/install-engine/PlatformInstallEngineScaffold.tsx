type PlatformInstallEngineScaffoldProps = {
  title: string;
  subtitle: string;
  statsLabel?: string;
  statsValue?: string;
  areas: string[];
};

/** Platform Admin — integration templates and global install metrics (Layer 1). */
export function PlatformInstallEngineScaffold({
  title,
  subtitle,
  statsLabel,
  statsValue,
  areas,
}: PlatformInstallEngineScaffoldProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        {statsLabel && statsValue ? (
          <p className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-sm text-emerald-900">
            <span className="font-medium">{statsLabel}:</span> {statsValue}
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
