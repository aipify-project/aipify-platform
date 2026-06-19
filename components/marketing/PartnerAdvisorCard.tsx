import Link from "next/link";

export type PartnerAdvisorLabels = {
  title: string;
  teamName: string;
  location: string;
  photoPlaceholder: string;
  role: string;
  availability: string;
  contactLabel: string;
  contactPath: string;
  services: string[];
};

type Props = {
  labels: PartnerAdvisorLabels;
};

export function PartnerAdvisorCard({ labels }: Props) {
  return (
    <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/30 to-indigo-950/20 p-6 shadow-lg shadow-violet-900/10">
      <h3 className="font-semibold text-white">{labels.title}</h3>
      <div className="mt-6 flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-lg font-bold text-white"
          aria-label={labels.photoPlaceholder}
        >
          PS
        </div>
        <div>
          <p className="text-base font-semibold text-white">{labels.teamName}</p>
          <p className="text-sm text-violet-200/90">{labels.location}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-aipify-text-muted">{labels.role}</p>
        </div>
      </div>
      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="sr-only">Availability</dt>
          <dd className="font-medium text-slate-200">{labels.availability}</dd>
        </div>
      </dl>
      <ul className="mt-4 space-y-2">
        {labels.services.map((service) => (
          <li key={service} className="flex gap-2 text-sm text-aipify-text-secondary">
            <span className="text-violet-400" aria-hidden="true">•</span>
            {service}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-aipify-text-muted">
        {labels.contactLabel}:{" "}
        <Link href="/contact" className="font-medium text-cyan-400 hover:underline">
          {labels.contactPath}
        </Link>
      </p>
    </div>
  );
}
