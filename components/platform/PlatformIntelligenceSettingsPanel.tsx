"use client";

type PlatformIntelligenceSettingsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    levels: {
      title: string;
      internal: { title: string; description: string };
      pilot: { title: string; description: string };
      customer: { title: string; description: string };
      global: { title: string; description: string };
    };
    privacy: {
      title: string;
      neverLearn: string;
      onlyLearn: string;
      neverItems: string[];
      onlyItems: string[];
    };
    tenantIsolation: {
      title: string;
      description: string;
    };
    publicTrust: {
      title: string;
      description: string;
    };
  };
};

export default function PlatformIntelligenceSettingsPanel({
  labels,
}: PlatformIntelligenceSettingsPanelProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.levels.title}</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {(["internal", "pilot", "customer", "global"] as const).map((level) => (
            <article key={level} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <h3 className="font-semibold text-gray-900">{labels.levels[level].title}</h3>
              <p className="mt-2 text-sm text-gray-600">{labels.levels[level].description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.tenantIsolation.title}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.tenantIsolation.description}</p>
      </section>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/30 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.publicTrust.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{labels.publicTrust.description}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6">
          <h2 className="text-lg font-semibold text-rose-900">{labels.privacy.neverLearn}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-rose-900/90">
            {labels.privacy.neverItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
          <h2 className="text-lg font-semibold text-emerald-900">{labels.privacy.onlyLearn}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-emerald-900/90">
            {labels.privacy.onlyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
