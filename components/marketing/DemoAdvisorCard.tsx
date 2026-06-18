import type { BookDemoAdvisor } from "@/lib/book-demo-discovery-center";

type AdvisorLabels = {
  title: string;
  photoPlaceholder: string;
  role: string;
  availability: string;
  languages: string;
  contact: string;
  email: string;
};

type Props = {
  advisor: BookDemoAdvisor | null;
  labels: AdvisorLabels;
};

export function DemoAdvisorCard({ advisor, labels }: Props) {
  if (!advisor) return null;

  const initials = advisor.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-violet-950/20 p-6 shadow-lg shadow-indigo-900/10">
      <h3 className="font-semibold text-white">{labels.title}</h3>
      <div className="mt-6 flex items-start gap-4">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-xl font-bold text-white"
          aria-label={labels.photoPlaceholder}
        >
          {initials}
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{advisor.displayName}</p>
          <p className="text-sm text-indigo-200/90">{advisor.roleTitle}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{labels.role}</p>
        </div>
      </div>
      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="text-slate-500">{labels.availability}</dt>
          <dd className="text-slate-200">
            {advisor.availabilityNote || advisor.availabilityStatus.replace(/_/g, " ")}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{labels.languages}</dt>
          <dd className="text-slate-200">{advisor.languages.join(", ")}</dd>
        </div>
        {advisor.contactEmail ? (
          <div>
            <dt className="text-slate-500">{labels.contact}</dt>
            <dd className="text-cyan-300/90">
              {labels.email}: {advisor.contactEmail}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
