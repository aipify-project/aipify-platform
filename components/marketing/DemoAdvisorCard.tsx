import type { BookDemoAdvisor } from "@/lib/book-demo-discovery-center";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

type AdvisorLabels = {
  title: string;
  photoPlaceholder: string;
  role: string;
  availability: string;
  languages: string;
  contact: string;
  email: string;
  availabilityStatuses: Record<string, string>;
};

type Props = {
  advisor: BookDemoAdvisor | null;
  labels: AdvisorLabels;
};

function formatAvailabilityStatus(status: string, statuses: Record<string, string>): string {
  const key = status.trim().toLowerCase();
  if (statuses[key]) return statuses[key];
  return status
    .trim()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function DemoAdvisorCard({ advisor, labels }: Props) {
  if (!advisor) return null;

  const initials = advisor.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const availabilityDisplay =
    advisor.availabilityNote ||
    formatAvailabilityStatus(advisor.availabilityStatus, labels.availabilityStatuses);

  return (
    <div className={`${PublicMarketingClasses.card} shadow-md`}>
      <h3 className="font-semibold text-aipify-text">{labels.title}</h3>
      <div className="mt-6 flex items-start gap-4">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-aipify-accent-soft text-xl font-bold text-aipify-companion"
          aria-label={labels.photoPlaceholder}
        >
          {initials}
        </div>
        <div>
          <p className="text-lg font-semibold text-aipify-text">{advisor.displayName}</p>
          <p className="text-sm text-aipify-text-secondary">{advisor.roleTitle}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-aipify-text-secondary">{labels.role}</p>
        </div>
      </div>
      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="text-aipify-text-secondary">{labels.availability}</dt>
          <dd className="text-aipify-text">{availabilityDisplay}</dd>
        </div>
        <div>
          <dt className="text-aipify-text-secondary">{labels.languages}</dt>
          <dd className="text-aipify-text">{advisor.languages.join(", ")}</dd>
        </div>
        {advisor.contactEmail ? (
          <div>
            <dt className="text-aipify-text-secondary">{labels.contact}</dt>
            <dd className="text-aipify-companion">
              {labels.email}: {advisor.contactEmail}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
