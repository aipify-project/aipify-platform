type PlatformTrustScaffoldProps = {
  title: string;
  subtitle: string;
  statsLabel?: string;
  statsValue?: string;
  areas: string[];
  responsibility?: string;
};

/** Platform Admin — trust governance without browsing customer operational data (Layer 1). */
export function PlatformTrustScaffold({
  title,
  subtitle,
  statsLabel,
  statsValue,
  areas,
  responsibility,
}: PlatformTrustScaffoldProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        {statsLabel && statsValue ? (
          <p className="mt-3 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900">
            <span className="font-medium">{statsLabel}:</span> {statsValue}
          </p>
        ) : null}
        {responsibility ? (
          <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm text-amber-900">
            {responsibility}
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
