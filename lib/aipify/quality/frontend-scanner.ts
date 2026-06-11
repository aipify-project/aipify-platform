import { evaluateImageAsset, type ImageAssetInput } from "./image-guardian";
import { evaluateMobileIssue, type MobileCheckInput } from "./mobile-checks";
import { evaluatePageSnapshot, type PageSnapshotInput } from "./performance-guardian";
import type { QualityScanResult } from "./types";
import {
  UNONIGHT_LOCALIZATION_ISSUES,
  UNONIGHT_MOBILE_ISSUES,
  UNONIGHT_SAMPLE_IMAGES,
  UNONIGHT_SAMPLE_SNAPSHOTS,
} from "./presets/unonight-frontend-checks";

export type FrontendScanOutput = {
  results: QualityScanResult[];
  assets: Record<string, unknown>[];
  snapshots: Record<string, unknown>[];
};

export type FrontendScanOptions = {
  tenantSlug?: string | null;
  scanType?: "images" | "performance" | "mobile" | "full_site" | "localization";
  images?: ImageAssetInput[];
  snapshots?: PageSnapshotInput[];
  mobileIssues?: MobileCheckInput[];
  thresholds?: {
    warningKb?: number;
    highKb?: number;
    pageWeightWarningMb?: number;
    pageWeightHighMb?: number;
  };
};

export function runFrontendExperienceScan(options: FrontendScanOptions = {}): FrontendScanOutput {
  const scanType = options.scanType ?? "full_site";
  const images =
    options.images ??
    (options.tenantSlug === "unonight" || !options.tenantSlug ? UNONIGHT_SAMPLE_IMAGES : []);
  const snapshots =
    options.snapshots ??
    (options.tenantSlug === "unonight" || !options.tenantSlug ? UNONIGHT_SAMPLE_SNAPSHOTS : []);
  const mobileIssues =
    options.mobileIssues ??
    (options.tenantSlug === "unonight" || !options.tenantSlug ? UNONIGHT_MOBILE_ISSUES : []);

  const thresholds = {
    warningKb: options.thresholds?.warningKb ?? 500,
    highKb: options.thresholds?.highKb ?? 1500,
    pageWeightWarningMb: options.thresholds?.pageWeightWarningMb ?? 3,
    pageWeightHighMb: options.thresholds?.pageWeightHighMb ?? 6,
    loadTimeWarningMs: 3000,
    loadTimeHighMs: 5000,
  };

  const assets: Record<string, unknown>[] = [];
  const snapshotRecords: Record<string, unknown>[] = [];
  const results: QualityScanResult[] = [];

  if (scanType === "images" || scanType === "full_site") {
    for (const img of images) {
      const { asset, incident } = evaluateImageAsset(img, {
        warningKb: thresholds.warningKb,
        highKb: thresholds.highKb,
      });
      assets.push(asset);
      if (incident) results.push(incident);
      else {
        results.push({
          incident_key: `quality.image.ok.${img.url}`,
          title: `Image OK: ${img.url}`,
          passed: true,
          scanner_type: "image_guardian",
          category: "images",
          expected_behavior: "Image within thresholds.",
        });
      }
    }
  }

  if (scanType === "performance" || scanType === "full_site") {
    for (const snap of snapshots) {
      const { snapshot, incidents } = evaluatePageSnapshot(snap, thresholds);
      snapshotRecords.push(snapshot);
      results.push(...incidents);
      if (incidents.length === 0) {
        results.push({
          incident_key: `quality.page.ok.${snap.page_url}.${snap.viewport}`,
          title: `Page OK: ${snap.page_url}`,
          passed: true,
          scanner_type: "performance_guardian",
          category: "performance",
          expected_behavior: "Page within performance thresholds.",
        });
      }
    }
  }

  if (scanType === "mobile" || scanType === "full_site") {
    for (const issue of mobileIssues) {
      results.push(evaluateMobileIssue(issue));
    }
  }

  if (scanType === "localization" || scanType === "full_site") {
    const locIssues =
      options.tenantSlug === "unonight" || !options.tenantSlug ? UNONIGHT_LOCALIZATION_ISSUES : [];
    for (const loc of locIssues) {
      results.push({
        incident_key: loc.incident_key,
        title: loc.title,
        passed: false,
        severity: loc.severity,
        scanner_type: "translation_monitor",
        category: "localization",
        incident_type: "missing_translation",
        page_url: loc.page_url,
        expected_behavior: "All UI strings should be translated for selected locale.",
        observed_behavior: loc.observed_behavior,
        impact: "Users may see mixed-language experience.",
        suggested_fix: "Add missing translation keys for Swedish locale.",
        recommendation_type: "fix_mobile_css",
      });
    }
  }

  return { results, assets, snapshots: snapshotRecords };
}
