import Link from "next/link";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

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
  const contactPath = labels.contactPath.trim();
  const contactHref =
    contactPath.includes("@") && !contactPath.includes(":") && !contactPath.includes(" ")
      ? `mailto:${contactPath}`
      : contactPath.startsWith("/")
        ? contactPath
        : "/contact";

  return (
    <div className={`${PublicMarketingClasses.card} shadow-md`}>
      <p className="text-sm font-semibold text-aipify-companion">{labels.title}</p>
      <div className="mt-4 flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-aipify-accent-soft text-lg font-bold text-aipify-companion"
          aria-label={labels.photoPlaceholder}
        >
          PS
        </div>
        <div>
          <h3 className="text-base font-semibold text-aipify-text">{labels.teamName}</h3>
          <p className="text-sm text-aipify-text-secondary">{labels.location}</p>
          {labels.role ? (
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-aipify-text-secondary">{labels.role}</p>
          ) : null}
        </div>
      </div>
      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="sr-only">Availability</dt>
          <dd className="font-medium text-aipify-text">{labels.availability}</dd>
        </div>
      </dl>
      <ul className="mt-4 space-y-2">
        {labels.services.map((service) => (
          <li key={service} className="flex gap-2 text-sm text-aipify-text-secondary">
            <span className="text-aipify-companion" aria-hidden="true">
              •
            </span>
            {service}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-aipify-text-secondary">
        {labels.contactLabel}:{" "}
        <Link href={contactHref} className={`font-medium ${PublicMarketingClasses.link}`}>
          {labels.contactPath}
        </Link>
      </p>
    </div>
  );
}
