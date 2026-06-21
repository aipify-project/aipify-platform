"use client";

import type { CompanionExperienceLabels } from "@/lib/app/companion/types";
import { CompanionDrawer } from "./CompanionDrawer";
import { CompanionExperienceProvider } from "./CompanionExperienceProvider";
import { CompanionFloatingButton } from "./CompanionFloatingButton";

type CompanionShellProps = {
  labels: CompanionExperienceLabels;
  locale: string;
  children: React.ReactNode;
};

/** Wraps customer app shell with global Companion drawer + floating access. */
export function CompanionShell({ labels, locale, children }: CompanionShellProps) {
  return (
    <CompanionExperienceProvider labels={labels} locale={locale}>
      {children}
      <CompanionDrawer />
      <CompanionFloatingButton />
    </CompanionExperienceProvider>
  );
}
