"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { AppSectionTabs, type AppSectionTabItem } from "@/components/app/design";
import { ECC590_SECTIONS, getEcc590ActiveSection } from "@/lib/executive-command-center-engine/config";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { EccTabIcons } from "./ecc-tab-icons";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;

const TAB_ICONS: Record<(typeof ECC590_SECTIONS)[number]["key"], ReactNode> = {
  overview: EccTabIcons.overview,
  sinceLastLogin: EccTabIcons.sinceLastLogin,
  alerts: EccTabIcons.alerts,
  approvals: EccTabIcons.approvals,
  risks: EccTabIcons.risks,
  opportunities: EccTabIcons.opportunities,
  performance: EccTabIcons.performance,
  companionBriefing: EccTabIcons.companionBriefing,
};

export function ExecutiveCommandCenterNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = getEcc590ActiveSection(pathname, searchParams.get("tab"));

  const items: AppSectionTabItem[] = ECC590_SECTIONS.map((item) => ({
    key: item.key,
    href: item.key === "sinceLastLogin" ? "/app/command-center?tab=since-last-login" : item.href,
    label: labels[item.key],
    icon: TAB_ICONS[item.key],
  }));

  return <AppSectionTabs items={items} activeKey={active} ariaLabel="Executive Command Center" />;
}
