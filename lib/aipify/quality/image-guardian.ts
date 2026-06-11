import type { QualityScanResult } from "./types";

export type ImageAssetInput = {
  url: string;
  page_url: string;
  file_format?: string;
  size_bytes: number;
  rendered_width?: number;
  rendered_height?: number;
  natural_width?: number;
  natural_height?: number;
  has_alt_text?: boolean;
  is_lazy_loaded?: boolean;
  has_width_height?: boolean;
  status_code?: number;
  above_the_fold?: boolean;
};

export type ImageThresholds = {
  warningKb: number;
  highKb: number;
};

const DEFAULT_THRESHOLDS: ImageThresholds = { warningKb: 500, highKb: 1500 };

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function evaluateImageAsset(
  asset: ImageAssetInput,
  thresholds: ImageThresholds = DEFAULT_THRESHOLDS
): { asset: Record<string, unknown>; incident?: QualityScanResult } {
  const record = {
    asset_type: "image",
    url: asset.url,
    page_url: asset.page_url,
    file_format: asset.file_format ?? asset.url.split(".").pop()?.split("?")[0],
    size_bytes: asset.size_bytes,
    rendered_width: asset.rendered_width,
    rendered_height: asset.rendered_height,
    natural_width: asset.natural_width,
    natural_height: asset.natural_height,
    has_alt_text: asset.has_alt_text ?? false,
    is_lazy_loaded: asset.is_lazy_loaded ?? false,
    has_width_height: asset.has_width_height ?? false,
    status_code: asset.status_code ?? 200,
    recommendation: null as string | null,
  };

  if (asset.status_code && asset.status_code >= 400) {
    return {
      asset: record,
      incident: {
        incident_key: `quality.image.broken.${hashUrl(asset.url)}`,
        title: "Broken image detected",
        passed: false,
        severity: "high",
        scanner_type: "image_guardian",
        category: "images",
        incident_type: "broken_image",
        page_url: asset.page_url,
        affected_asset_url: asset.url,
        expected_behavior: "Image should load with HTTP 200.",
        observed_behavior: `Image returned HTTP ${asset.status_code}.`,
        impact: "Users may see broken media and reduced trust.",
        suggested_fix: "Fix image URL, permissions, or hosting.",
        recommendation_type: "fix_link",
        evidence: { status_code: asset.status_code },
      },
    };
  }

  const warningBytes = thresholds.warningKb * 1024;
  const highBytes = thresholds.highKb * 1024;
  const criticalBytes = 5 * 1024 * 1024;

  if (asset.size_bytes > criticalBytes && asset.above_the_fold) {
    record.recommendation = "Critical: compress and resize above-the-fold image.";
    return {
      asset: record,
      incident: {
        incident_key: `quality.image.oversized.critical.${hashUrl(asset.url)}`,
        title: "Critical oversized hero image",
        passed: false,
        severity: "critical",
        scanner_type: "image_guardian",
        category: "images",
        incident_type: "oversized_image",
        page_url: asset.page_url,
        affected_asset_url: asset.url,
        expected_behavior: "Hero images should be optimized for web and mobile, typically under configured thresholds.",
        observed_behavior: `Image is ${formatBytes(asset.size_bytes)} and loads above the fold.`,
        impact: "Mobile users may experience very slow first paint and lower conversions.",
        suggested_fix: "Convert to WebP/AVIF, resize to display dimensions, use responsive srcset, lazy-load non-critical variants.",
        recommendation_type: "compress_image",
        evidence: { size_bytes: asset.size_bytes, above_the_fold: true },
      },
    };
  }

  if (asset.size_bytes > highBytes) {
    record.recommendation = "Compress and convert to modern format (WebP/AVIF).";
    return {
      asset: record,
      incident: {
        incident_key: `quality.image.oversized.high.${hashUrl(asset.url)}`,
        title: "Oversized image detected",
        passed: false,
        severity: "high",
        scanner_type: "image_guardian",
        category: "images",
        incident_type: "oversized_image",
        page_url: asset.page_url,
        affected_asset_url: asset.url,
        expected_behavior: `Normal content images should stay under ${thresholds.highKb} KB unless intentionally high-resolution.`,
        observed_behavior: `Image is ${formatBytes(asset.size_bytes)}.`,
        impact: "Page weight increases and mobile experience may slow down.",
        suggested_fix: "Resize image, convert to WebP/AVIF, and add responsive sizes.",
        recommendation_type: "convert_to_webp",
        evidence: { size_bytes: asset.size_bytes },
      },
    };
  }

  if (asset.size_bytes > warningBytes) {
    record.recommendation = "Consider compressing this image.";
    return {
      asset: record,
      incident: {
        incident_key: `quality.image.oversized.warn.${hashUrl(asset.url)}`,
        title: "Image larger than recommended",
        passed: false,
        severity: "medium",
        scanner_type: "image_guardian",
        category: "images",
        incident_type: "oversized_image",
        page_url: asset.page_url,
        affected_asset_url: asset.url,
        expected_behavior: `Content images should ideally stay under ${thresholds.warningKb} KB.`,
        observed_behavior: `Image is ${formatBytes(asset.size_bytes)}.`,
        impact: "May contribute to heavier pages on mobile networks.",
        suggested_fix: "Compress image and verify display dimensions match file size.",
        recommendation_type: "compress_image",
        evidence: { size_bytes: asset.size_bytes },
      },
    };
  }

  if (!asset.has_alt_text) {
    return {
      asset: record,
      incident: {
        incident_key: `quality.image.missing_alt.${hashUrl(asset.url)}`,
        title: "Missing alt text on image",
        passed: false,
        severity: "info",
        scanner_type: "image_guardian",
        category: "images",
        incident_type: "missing_alt_text",
        page_url: asset.page_url,
        affected_asset_url: asset.url,
        expected_behavior: "Meaningful images should include descriptive alt text.",
        observed_behavior: "Alt text is missing.",
        impact: "Accessibility and SEO may be reduced.",
        suggested_fix: "Add concise alt text describing the image purpose.",
        recommendation_type: "add_alt_text",
      },
    };
  }

  if (
    asset.natural_width &&
    asset.rendered_width &&
    asset.natural_width > asset.rendered_width * 2
  ) {
    record.recommendation = "Serve a smaller image matching display size.";
    return {
      asset: record,
      incident: {
        incident_key: `quality.image.oversized_render.${hashUrl(asset.url)}`,
        title: "Image dimensions exceed rendered size",
        passed: false,
        severity: "low",
        scanner_type: "image_guardian",
        category: "images",
        incident_type: "oversized_image",
        page_url: asset.page_url,
        affected_asset_url: asset.url,
        expected_behavior: "Image natural dimensions should be close to rendered size (responsive images).",
        observed_behavior: `Natural width ${asset.natural_width}px vs rendered ${asset.rendered_width}px.`,
        suggested_fix: "Add srcset/sizes and resize source image.",
        recommendation_type: "compress_image",
      },
    };
  }

  const format = (asset.file_format ?? "").toLowerCase();
  if (format === "png" && asset.size_bytes > 200 * 1024 && !asset.url.includes("logo")) {
    record.recommendation = "Consider WebP/JPEG unless transparency is required.";
    return {
      asset: record,
      incident: {
        incident_key: `quality.image.format.${hashUrl(asset.url)}`,
        title: "PNG used for large photo-like image",
        passed: false,
        severity: "low",
        scanner_type: "image_guardian",
        category: "images",
        incident_type: "wrong_image_format",
        page_url: asset.page_url,
        affected_asset_url: asset.url,
        expected_behavior: "Photos should use JPEG/WebP/AVIF unless transparency is needed.",
        observed_behavior: `Large PNG (${formatBytes(asset.size_bytes)}) detected.`,
        suggested_fix: "Convert to WebP or JPEG if transparency is not required.",
        recommendation_type: "convert_to_webp",
      },
    };
  }

  return { asset: record };
}

function hashUrl(url: string): string {
  return url.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
}
