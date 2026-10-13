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
    "group flex h-full min-h-[22rem] w-full cursor-pointer flex-col rounded-[28px] border bg-white p-8 text-left shadow-[0_12px_30px_rgba(38,33,87,.07)] sm:min-h-[24rem] sm:p-9",
    "transition-[box-shadow,border-color,color] duration-150 ease-out",
    "hover:border-[#7357e8]/50 hover:shadow-[0_18px_40px_rgba(46,38,104,.12)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5577f2]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f5fb]",
    selected ? "border-[#7357e8] ring-2 ring-[#eeeafe]" : "border-[rgba(96,82,176,.15)]",
  ].join(" ");
}

export function PortalEntryCard(props: PortalEntryCardProps) {
  const { icon: Icon, title, description, actionLabel, a11yLabel, selected, selectedStateLabel } =
    props;

  const content = (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eeeafe,#e8eefc)] text-[#6042d4] ring-1 ring-[rgba(96,82,176,.15)] transition group-hover:bg-[linear-gradient(135deg,#e4ddff,#dde6ff)]">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="mt-7 text-xl font-bold tracking-tight text-[#1f2235] sm:text-[1.35rem]">
          {title}
        </h2>
        <p className="mt-4 flex-1 text-base leading-7 text-[#687086]">{description}</p>
      </div>

      <div className="mt-7 flex min-h-[2.75rem] shrink-0 items-center border-t border-[rgba(96,82,176,.12)] pt-5">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-[#6042d4] transition group-hover:text-[#7357e8] sm:text-[0.9375rem]">
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
