import type { ReactNode } from "react";
import { AipifyPublicFormClasses } from "@/lib/public-forms/public-form-ui";

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 9v4.5M10 6.75h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
  testId?: string;
};

/** Soft info strip used on public apply / support forms. */
export function PublicFormInfoNotice({ title, children, className = "", testId }: Props) {
  return (
    <div className={`${AipifyPublicFormClasses.infoBox} ${className}`.trim()} data-testid={testId}>
      <span className="mt-0.5 shrink-0 text-aipify-text-secondary">
        <InfoIcon />
      </span>
      <div className="min-w-0">
        {title ? <p className="font-semibold text-aipify-text">{title}</p> : null}
        <div className={title ? "mt-1 leading-relaxed text-aipify-text-secondary" : "leading-relaxed text-aipify-text-secondary"}>
          {children}
        </div>
      </div>
    </div>
  );
}
