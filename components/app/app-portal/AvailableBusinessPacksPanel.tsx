"use client";

import { useSearchParams } from "next/navigation";
import {
  AppStoreHomePanel,
  AppStorePackDetailPanel,
  type AppStoreCatalogRouting,
} from "@/components/app/app-store";
import type { AppStoreLabels } from "@/lib/app-store/labels";

const CATALOG_BASE = "/app/business-packs/available";

function buildCatalogRouting(): AppStoreCatalogRouting {
  return {
    detailHref: (packKey) => `${CATALOG_BASE}?pack=${encodeURIComponent(packKey)}`,
    installHref: (packKey) =>
      `${CATALOG_BASE}?pack=${encodeURIComponent(packKey)}&action=install`,
    upgradeHref: (packKey) =>
      `${CATALOG_BASE}?pack=${encodeURIComponent(packKey)}&action=upgrade`,
  };
}

export function AvailableBusinessPacksPanel({
  labels,
  locale = "en",
  backLabel,
  upgradeTitle,
  upgradeBody,
  upgradeCta,
}: {
  labels: AppStoreLabels;
  locale?: string;
  backLabel?: string;
  upgradeTitle?: string;
  upgradeBody?: string;
  upgradeCta?: string;
}) {
  const searchParams = useSearchParams();
  const packKey = searchParams.get("pack")?.trim() ?? "";
  const catalogRouting = buildCatalogRouting();

  if (packKey) {
    return (
      <AppStorePackDetailPanel
        packKey={packKey}
        labels={labels}
        backHref={CATALOG_BASE}
        backLabel={backLabel}
        upgradeTitle={upgradeTitle}
        upgradeBody={upgradeBody}
        upgradeCta={upgradeCta}
      />
    );
  }

  return (
    <AppStoreHomePanel
      labels={labels}
      locale={locale}
      hideHeader
      catalogRouting={catalogRouting}
    />
  );
}
