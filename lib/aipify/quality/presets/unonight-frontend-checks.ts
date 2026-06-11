import type { ImageAssetInput } from "../image-guardian";
import type { MobileCheckInput } from "../mobile-checks";
import type { PageSnapshotInput } from "../performance-guardian";

/** Simulated Unonight frontend scan data for pilot observation mode. */
export const UNONIGHT_TARGET_PAGES = {
  public: ["/", "/about", "/register", "/login", "/privacy", "/terms"],
  member: ["/dashboard", "/profile", "/discover", "/chat", "/marketplace", "/settings", "/upgrade", "/verification"],
  admin: ["/admin", "/admin/verification", "/admin/moderation", "/admin/support"],
} as const;

export const UNONIGHT_SAMPLE_IMAGES: ImageAssetInput[] = [
  {
    url: "https://unonight.com/images/hero/banner.jpg",
    page_url: "/",
    file_format: "jpeg",
    size_bytes: 14_200_000,
    rendered_width: 1200,
    rendered_height: 600,
    natural_width: 4000,
    natural_height: 2000,
    has_alt_text: false,
    is_lazy_loaded: false,
    has_width_height: false,
    above_the_fold: true,
  },
  {
    url: "https://unonight.com/images/marketplace/card-01.png",
    page_url: "/marketplace",
    file_format: "png",
    size_bytes: 890_000,
    rendered_width: 320,
    rendered_height: 240,
    natural_width: 1280,
    natural_height: 960,
    has_alt_text: true,
    is_lazy_loaded: true,
    has_width_height: true,
  },
  {
    url: "https://unonight.com/images/profile/avatar-placeholder.jpg",
    page_url: "/profile",
    file_format: "jpeg",
    size_bytes: 120_000,
    rendered_width: 96,
    rendered_height: 96,
    has_alt_text: true,
    is_lazy_loaded: true,
    has_width_height: true,
  },
  {
    url: "https://unonight.com/images/broken/missing.jpg",
    page_url: "/register",
    file_format: "jpeg",
    size_bytes: 0,
    status_code: 404,
    has_alt_text: false,
  },
];

export const UNONIGHT_SAMPLE_SNAPSHOTS: PageSnapshotInput[] = [
  {
    page_url: "/",
    viewport: "mobile_standard",
    load_time_ms: 5200,
    total_page_weight_bytes: 16_500_000,
    request_count: 87,
    image_weight_bytes: 14_500_000,
    script_weight_bytes: 1_200_000,
    css_weight_bytes: 180_000,
  },
  {
    page_url: "/",
    viewport: "desktop",
    load_time_ms: 2800,
    total_page_weight_bytes: 16_800_000,
    request_count: 92,
    image_weight_bytes: 14_600_000,
    script_weight_bytes: 1_250_000,
  },
  {
    page_url: "/marketplace",
    viewport: "mobile_standard",
    load_time_ms: 3100,
    total_page_weight_bytes: 4_200_000,
    request_count: 64,
    image_weight_bytes: 2_800_000,
    script_weight_bytes: 980_000,
    layout_issue_count: 1,
  },
  {
    page_url: "/chat",
    viewport: "mobile_small",
    load_time_ms: 2400,
    total_page_weight_bytes: 2_100_000,
    request_count: 45,
    script_weight_bytes: 1_100_000,
    layout_issue_count: 1,
  },
];

export const UNONIGHT_MOBILE_ISSUES: MobileCheckInput[] = [
  {
    page_url: "/chat",
    viewport: "mobile_small",
    issue: "Send button overlaps message input on iPhone small viewport.",
    component: "chat_composer",
    severity: "high",
  },
  {
    page_url: "/marketplace",
    viewport: "mobile_standard",
    issue: "Marketplace cards cause minor horizontal scroll on narrow screens.",
    component: "listing_grid",
    severity: "medium",
  },
  {
    page_url: "/upgrade",
    viewport: "mobile_standard",
    issue: "Upgrade CTA visible but Shopify link not verified in last scan.",
    component: "upgrade_button",
    severity: "medium",
  },
];

export const UNONIGHT_LOCALIZATION_ISSUES = [
  {
    page_url: "/register",
    incident_key: "quality.localization.sv.missing",
    title: "Missing Swedish translations on registration",
    observed_behavior: "2 UI strings still display English on /register?lang=sv.",
    severity: "medium" as const,
  },
];
