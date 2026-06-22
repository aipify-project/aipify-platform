"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type PortalEntryCardBaseProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  a11yLabel: string;
  selected?: boolean;
  selectedStateLabel?: string;
};

type PortalEntryCardButtonProps = PortalEntryCardBaseProps & {
  href?: never;
  onSelect: () => void;
};

type PortalEntryCardLinkProps = PortalEntryCardBaseProps & {
  href: string;
  onSelect?: never;
};

export type PortalEntryCardProps = PortalEntryCardButtonProps | PortalEntryCardLinkProps;

function cardClassName(selected?: boolean) {
  return [
    "group flex h-full min-h-[22rem] w-full cursor-pointer flex-col rounded-2xl border bg-white p-8 text-left shadow-sm sm:min-h-[24rem] sm:p-9",
    "transition-[transform,box-shadow,border-color,color] duration-150 ease-out",
    "hover:-translate-y-px hover:border-violet-600 hover:shadow-md",
    "active:translate-y-0 active:shadow-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50",
    selected ? "border-violet-500 ring-2 ring-violet-200" : "border-gray-200",
  ].join(" ");
}

export function PortalEntryCard(props: PortalEntryCardProps) {
  const { icon: Icon, title, description, actionLabel, a11yLabel, selected, selectedStateLabel } =
    props;

  const content = (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100 transition group-hover:bg-violet-100 group-hover:ring-violet-200">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="mt-7 text-xl font-bold tracking-tight text-gray-900 sm:text-[1.35rem]">
          {title}
        </h2>
        <p className="mt-4 flex-1 text-base leading-7 text-gray-600">{description}</p>
      </div>

      <div className="mt-7 flex min-h-[2.75rem] shrink-0 items-center border-t border-gray-100 pt-5">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-violet-700 transition group-hover:font-bold group-hover:text-violet-800 sm:text-[0.9375rem]">
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </p>
      </div>

      {selected && selectedStateLabel ? (
        <p className="sr-only">{selectedStateLabel}</p>
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cardClassName(selected)} aria-label={a11yLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={props.onSelect}
      className={cardClassName(selected)}
      aria-label={a11yLabel}
    >
      {content}
    </button>
  );
}
