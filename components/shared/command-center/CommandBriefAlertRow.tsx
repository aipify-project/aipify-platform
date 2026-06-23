"use client";

import { CommandBriefItemRow } from "@/components/shared/command-center/CommandBriefItemRow";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";

type CommandBriefAlertRowProps = {
  item: CommandCenterItem;
  locale: string;
  labels: {
    alertImpact: string;
    activityAction: string;
  };
  resolveLabel: (key: string) => string;
};

function alertIcon(item: CommandCenterItem) {
  const type = String(item.itemType ?? "").toLowerCase();
  if (type.includes("security") || type.includes("compliance")) return EccTabIcons.risks;
  if (type.includes("approval")) return EccTabIcons.approvals;
  if (type.includes("customer") || type.includes("risk")) return EccTabIcons.critical;
  if (type.includes("invoice") || type.includes("billing")) return EccTabIcons.action;
  return EccTabIcons.alerts;
}

export function CommandBriefAlertRow({ item, locale, labels, resolveLabel }: CommandBriefAlertRowProps) {
  return (
    <CommandBriefItemRow
      item={item}
      locale={locale}
      icon={alertIcon(item)}
      sourcePrefix={labels.alertImpact}
      resolveLabel={resolveLabel}
      asLink
    />
  );
}
