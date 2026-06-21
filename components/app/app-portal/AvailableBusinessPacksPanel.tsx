"use client";

import { useSearchParams } from "next/navigation";
import {
  AppStoreHomePanel,
  AppStorePackDetailPanel,
  type AppStoreCatalogRouting,
} from "@/components/app/app-store";
import { BusinessPackCapabilityDetailPanel } from "@/components/app/app-portal/BusinessPackCapabilityDetailPanel";
import { BusinessPackUnavailablePanel } from "@/components/app/app-portal/BusinessPackUnavailablePanel";
import type { BusinessPackDetailLabels } from "@/lib/app-portal/business-pack-detail-labels";
import {
  buildBusinessPackLearnMoreHref,
  resolveBusinessPackIdentifier,
} from "@/lib/app-portal/business-pack-resolver";
import type { AppStoreLabels } from "@/lib/app-store/labels";
import type { Translator } from "@/lib/i18n/translate";

const CATALOG_BASE = "/app/business-packs/available";

function buildCatalogRouting(): AppStoreCatalogRouting {
  return {
    detailHref: (packKey) => {
      const resolved = resolveBusinessPackIdentifier(packKey);
      const href = buildBusinessPackLearnMoreHref(packKey, resolved);
      return href ?? CATALOG_BASE;
    },
    installHref: (packKey) => {
      const resolved = resolveBusinessPackIdentifier(packKey);
      const slug =
        resolved.kind === "catalog_pack" ? resolved.slug : packKey;
      return `${CATALOG_BASE}?pack=${encodeURIComponent(slug)}&action=install`;
    },
    upgradeHref: (packKey) => {
      const resolved = resolveBusinessPackIdentifier(packKey);
      const slug =
        resolved.kind === "catalog_pack" ? resolved.slug : packKey;
      return `${CATALOG_BASE}?pack=${encodeURIComponent(slug)}&action=upgrade`;
    },
  };
}

export function AvailableBusinessPacksPanel({
  labels,
  detailLabels,
  t,
  locale = "en",
  backLabel,
  upgradeTitle,
  upgradeBody,
  upgradeCta,
}: {
  labels: AppStoreLabels;
  detailLabels: BusinessPackDetailLabels;
  t: Translator;
  locale?: string;
  backLabel?: string;
  upgradeTitle?: string;
  upgradeBody?: string;
  upgradeCta?: string;
}) {
  const searchParams = useSearchParams();
  const packParam = searchParams.get("pack")?.trim() ?? "";
  const catalogRouting = buildCatalogRouting();

  if (packParam) {
    const resolved = resolveBusinessPackIdentifier(packParam);

    if (resolved.kind === "unknown") {
      return (
        <BusinessPackUnavailablePanel
          labels={detailLabels}
          backHref={CATALOG_BASE}
          backLabel={backLabel}
        />
      );
    }

    if (resolved.kind === "capability") {
      return (
        <BusinessPackCapabilityDetailPanel
          entry={resolved}
          labels={detailLabels}
          t={t}
          backHref={CATALOG_BASE}
          backLabel={backLabel}
        />
      );
    }

    return (
      <AppStorePackDetailPanel
        packKey={resolved.catalogPackKey}
        labels={labels}
        backHref={CATALOG_BASE}
        backLabel={backLabel}
        upgradeTitle={upgradeTitle}
        upgradeBody={upgradeBody}
        upgradeCta={upgradeCta}
        detailLabels={detailLabels}
        resolvedSlug={resolved.slug}
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
