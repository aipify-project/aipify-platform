"use client";

import Link from "next/link";
import AipifyPulse from "@/components/branding/AipifyPulse";

export type PlatformEmptyStateProps = {
  title: string;
  message: string;
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  className?: string;
};

export function PlatformEmptyState({
  title,
  message,
  primaryAction,
  secondaryAction,
  className = "",
}: PlatformEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center ${className}`}
    >
      <AipifyPulse
        size="lg"
        variant="gradient"
        opacity={0.14}
        title={title}
        aria-label={title}
        className="text-violet-600"
      />
      <h3 className="mt-5 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-600">{message}</p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? (
            primaryAction.href ? (
              <Link
                href={primaryAction.href}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                {primaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                {primaryAction.label}
              </button>
            )
          ) : null}
          {secondaryAction ? (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                {secondaryAction.label}
              </button>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}
