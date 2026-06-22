import type { UnonightMemberStatisticsSnapshot } from "./member-statistics";

export type UnonightAdapterSignalCounts = {
  group_count: number | null;
  discussion_count: number | null;
  pending_moderation_count: number | null;
  pending_verification_count: number | null;
  verification_needs_information_count?: number | null;
  verification_high_priority_count?: number | null;
  reports_attention_count: number | null;
  listing_review_count: number | null;
  member_statistics: UnonightMemberStatisticsSnapshot | null;
};
