import { LEARNING_PHASE_DAYS } from "@/lib/install";

type LearningOverviewScaffoldProps = {
  title: string;
  subtitle: string;
  durationLabel: string;
  areas: string[];
};

/** Customer App — supervised learning phase overview (Layer 2). */
export function LearningOverviewScaffold({
  title,
  subtitle,
  durationLabel,
  areas,
}: LearningOverviewScaffoldProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm text-amber-900">
          {durationLabel.replace("{days}", String(LEARNING_PHASE_DAYS))}
        </p>
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
