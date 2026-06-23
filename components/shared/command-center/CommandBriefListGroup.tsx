"use client";

import type { ReactNode } from "react";

type CommandBriefListGroupProps = {
  children: ReactNode;
  labelledBy?: string;
};

/** Rounded, grouped list container for Command Brief overview rows. */
export function CommandBriefListGroup({ children, labelledBy }: CommandBriefListGroupProps) {
  return (
    <ul
      aria-labelledby={labelledBy}
      className="divide-y divide-aipify-border overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-sm"
    >
      {children}
    </ul>
  );
}
