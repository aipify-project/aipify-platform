import type {
  PartnerAdvisorGoal,
  PartnerAdvisorGoalsBundle,
  PartnerAdvisorMessage,
  PartnerAdvisorMessagesBundle,
  PartnerAdvisorOverview,
  PartnerAdvisorProfile,
  PartnerAdvisorReview,
  PartnerAdvisorReviewsBundle,
  PartnerAdvisorJourneyMilestone,
} from "./types";

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function asStringArray(data: unknown): string[] {
  return asArray<unknown>(data).map(String);
}

export function parsePartnerAdvisorProfile(data: unknown): PartnerAdvisorProfile {
  const d = asRecord(data);
  return {
    id: String(d.id ?? ""),
    advisor_key: String(d.advisor_key ?? ""),
    display_name: String(d.display_name ?? ""),
    role_title: String(d.role_title ?? ""),
    advisor_type: String(d.advisor_type ?? ""),
    photo_url: String(d.photo_url ?? ""),
    languages: asStringArray(d.languages),
    availability_status: String(d.availability_status ?? ""),
    availability_note: String(d.availability_note ?? ""),
    contact_email: String(d.contact_email ?? ""),
    contact_calendar_url: String(d.contact_calendar_url ?? ""),
    contact_chat_enabled: Boolean(d.contact_chat_enabled),
    partners_supported: Number(d.partners_supported ?? 0),
    avg_partner_growth_pct: Number(d.avg_partner_growth_pct ?? 0),
    partner_retention_pct: Number(d.partner_retention_pct ?? 0),
  };
}

export function parsePartnerAdvisorMessage(data: unknown): PartnerAdvisorMessage {
  const d = asRecord(data);
  return {
    id: String(d.id ?? ""),
    message_key: d.message_key ? String(d.message_key) : undefined,
    message_source: String(d.message_source ?? ""),
    message_type: String(d.message_type ?? ""),
    subject: String(d.subject ?? ""),
    body: String(d.body ?? ""),
    sender_name: String(d.sender_name ?? ""),
    direction: d.direction ? String(d.direction) : undefined,
    is_read: Boolean(d.is_read),
    created_at: String(d.created_at ?? ""),
  };
}

export function parsePartnerAdvisorReview(data: unknown): PartnerAdvisorReview {
  const d = asRecord(data);
  return {
    id: String(d.id ?? ""),
    review_key: d.review_key ? String(d.review_key) : undefined,
    review_type: String(d.review_type ?? ""),
    scheduled_date: String(d.scheduled_date ?? ""),
    review_status: String(d.review_status ?? ""),
    advisor_notes: String(d.advisor_notes ?? ""),
    recommendations: asStringArray(d.recommendations),
    action_items: asStringArray(d.action_items),
    updated_at: d.updated_at ? String(d.updated_at) : undefined,
  };
}

export function parsePartnerAdvisorGoal(data: unknown): PartnerAdvisorGoal {
  const d = asRecord(data);
  return {
    id: String(d.id ?? ""),
    goal_key: d.goal_key ? String(d.goal_key) : undefined,
    goal_type: String(d.goal_type ?? ""),
    title: String(d.title ?? ""),
    description: String(d.description ?? ""),
    target_value: Number(d.target_value ?? 0),
    current_value: Number(d.current_value ?? 0),
    goal_status: String(d.goal_status ?? ""),
    due_date: String(d.due_date ?? ""),
    updated_at: d.updated_at ? String(d.updated_at) : undefined,
  };
}

export function parsePartnerAdvisorOverview(data: unknown): PartnerAdvisorOverview | null {
  const d = asRecord(data);
  if (!d.has_access || d.filtered_out) return null;

  const partnerInfo = d.partner_info ? asRecord(d.partner_info) : null;
  const assignment = d.assignment ? asRecord(d.assignment) : null;
  const successPlan = d.success_plan ? asRecord(d.success_plan) : null;
  const empty = d.empty_state ? asRecord(d.empty_state) : null;

  return {
    has_access: true,
    can_write: Boolean(d.can_write),
    team_role: d.team_role ? String(d.team_role) : undefined,
    access_denied: Boolean(d.access_denied),
    positioning: d.positioning ? String(d.positioning) : undefined,
    partner_info: partnerInfo
      ? {
          org_name: String(partnerInfo.org_name ?? ""),
          partner_type: String(partnerInfo.partner_type ?? ""),
          country_code: String(partnerInfo.country_code ?? ""),
          joined_date: String(partnerInfo.joined_date ?? ""),
          contact_email: String(partnerInfo.contact_email ?? ""),
          company_name: String(partnerInfo.company_name ?? ""),
        }
      : undefined,
    has_advisor: Boolean(d.has_advisor),
    advisor: d.advisor ? parsePartnerAdvisorProfile(d.advisor) : null,
    assignment: assignment
      ? {
          status: String(assignment.status ?? ""),
          introduction_scheduled_at: String(assignment.introduction_scheduled_at ?? ""),
          introduction_completed_at: String(assignment.introduction_completed_at ?? ""),
        }
      : null,
    health_score_label: String(d.health_score_label ?? ""),
    health_score_pct: Number(d.health_score_pct ?? 0),
    readiness_score_pct: Number(d.readiness_score_pct ?? 0),
    recommendations: asStringArray(d.recommendations),
    advisor_insights: asStringArray(d.advisor_insights),
    upcoming_reviews: asArray<unknown>(d.upcoming_reviews).map((row) => {
      const r = asRecord(row);
      return {
        id: String(r.id ?? ""),
        review_type: String(r.review_type ?? ""),
        scheduled_date: String(r.scheduled_date ?? ""),
        review_status: String(r.review_status ?? ""),
      };
    }),
    recent_messages: asArray<unknown>(d.recent_messages).map(parsePartnerAdvisorMessage),
    success_plan: successPlan
      ? {
          current_stage: String(successPlan.current_stage ?? ""),
          next_milestone: String(successPlan.next_milestone ?? ""),
          recommended_actions: asStringArray(successPlan.recommended_actions),
          estimated_time: String(successPlan.estimated_time ?? ""),
          expected_outcome: String(successPlan.expected_outcome ?? ""),
        }
      : null,
    journey: asArray<unknown>(d.journey).map((row) => {
      const j = asRecord(row);
      return {
        id: String(j.id ?? ""),
        milestone_category: String(j.milestone_category ?? ""),
        title: String(j.title ?? ""),
        summary: String(j.summary ?? ""),
        achieved_at: String(j.achieved_at ?? ""),
      } satisfies PartnerAdvisorJourneyMilestone;
    }),
    companion_signals: asArray<unknown>(d.companion_signals).map((row) => {
      const s = asRecord(row);
      return {
        id: String(s.id ?? ""),
        signal_type: String(s.signal_type ?? ""),
        summary: String(s.summary ?? ""),
        priority: String(s.priority ?? ""),
        created_at: String(s.created_at ?? ""),
      };
    }),
    empty_state: empty
      ? {
          title: String(empty.title ?? ""),
          message: String(empty.message ?? ""),
          cta: String(empty.cta ?? ""),
        }
      : undefined,
  };
}

export function parsePartnerAdvisorReviews(data: unknown): PartnerAdvisorReviewsBundle | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    can_write: Boolean(d.can_write),
    reviews: asArray<unknown>(d.reviews).map(parsePartnerAdvisorReview),
  };
}

export function parsePartnerAdvisorMessages(data: unknown): PartnerAdvisorMessagesBundle | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    can_write: Boolean(d.can_write),
    messages: asArray<unknown>(d.messages).map(parsePartnerAdvisorMessage),
  };
}

export function parsePartnerAdvisorGoals(data: unknown): PartnerAdvisorGoalsBundle | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    can_write: Boolean(d.can_write),
    goals: asArray<unknown>(d.goals).map(parsePartnerAdvisorGoal),
  };
}
