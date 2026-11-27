import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import {
  ACCOUNT_PROFILE_FORM_CARD_CLASS,
  ACCOUNT_PROFILE_HINT_CLASS,
  ACCOUNT_PROFILE_LABEL_CLASS,
} from "@/lib/app/account-profile/form-styles";

export function AccountProfileFormCard({
  title,
  titleIcon,
  children,
  footer,
  className = "",
}: {
  title?: string;
  titleIcon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${ACCOUNT_PROFILE_FORM_CARD_CLASS}${className ? ` ${className}` : ""}`}>
      <div className="space-y-5">
        {title ? (
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              {titleIcon}
              {title}
            </h2>
          </div>
        ) : null}
        {children}
        {footer ? (
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AccountProfileFormField({
  label,
  htmlFor,
  hint,
  lockReason,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  lockReason?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={ACCOUNT_PROFILE_LABEL_CLASS}>
            {label}
          </label>
        ) : (
          <p className={ACCOUNT_PROFILE_LABEL_CLASS}>{label}</p>
        )}
        {lockReason ? (
          <span className="inline-flex items-center text-gray-400" title={lockReason}>
            <LockKeyhole aria-hidden className="h-3.5 w-3.5" />
            <span className="sr-only">{lockReason}</span>
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <p className={ACCOUNT_PROFILE_HINT_CLASS}>{hint}</p> : null}
    </div>
  );
}
