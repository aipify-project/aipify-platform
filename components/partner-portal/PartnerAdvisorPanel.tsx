"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  advisorTypeLabel,
  availabilityLabel,
  goalStatusLabel,
  goalTypeLabel,
  healthLabel,
  messageSourceLabel,
  messageTypeLabel,
  parsePartnerAdvisorGoals,
  parsePartnerAdvisorMessages,
  parsePartnerAdvisorOverview,
  parsePartnerAdvisorReviews,
  reviewStatusLabel,
  reviewTypeLabel,
  type PartnerAdvisorGoal,
  type PartnerAdvisorMessage,
  type PartnerAdvisorOverview,
  type PartnerAdvisorReview,
} from "@/lib/partner-advisor";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function HealthBadge({ labels, value }: { labels: Record<string, string>; value: string }) {
  const tone =
    value === "excellent"
      ? "bg-emerald-100 text-emerald-900"
      : value === "healthy"
        ? "bg-sky-100 text-sky-900"
        : value === "at_risk"
          ? "bg-rose-100 text-rose-900"
          : "bg-amber-100 text-amber-900";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>
      {healthLabel(labels, value)}
    </span>
  );
}

export function PartnerAdvisorPanel({ labels }: Props) {
  const [overview, setOverview] = useState<PartnerAdvisorOverview | null>(null);
  const [reviews, setReviews] = useState<PartnerAdvisorReview[]>([]);
  const [messages, setMessages] = useState<PartnerAdvisorMessage[]>([]);
  const [goals, setGoals] = useState<PartnerAdvisorGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState("");
  const [messageSource, setMessageSource] = useState("");
  const [goalStatus, setGoalStatus] = useState("");

  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (healthFilter) params.set("health_score", healthFilter);
    if (messageSource) params.set("message_source", messageSource);
    if (goalStatus) params.set("goal_status", goalStatus);
    return params.toString();
  }, [goalStatus, healthFilter, messageSource, search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setDenied(false);
    try {
      const qs = queryString ? `?${queryString}` : "";
      const [overviewRes, reviewsRes, messagesRes, goalsRes] = await Promise.all([
        fetch(`/api/partner/advisor${qs}`),
        fetch(`/api/partner/advisor/reviews${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`),
        fetch(`/api/partner/advisor/messages${qs ? qs.replace(/^\?/, "?") : ""}`),
        fetch(`/api/partner/advisor/goals${goalStatus ? `?goal_status=${goalStatus}` : ""}`),
      ]);

      const overviewJson = overviewRes.ok ? await overviewRes.json() : null;
      if (!overviewJson?.has_access) {
        setDenied(Boolean(overviewJson?.access_denied ?? !overviewJson?.has_access));
        setLoading(false);
        return;
      }

      setOverview(parsePartnerAdvisorOverview(overviewJson));
      if (reviewsRes.ok) {
        const parsed = parsePartnerAdvisorReviews(await reviewsRes.json());
        setReviews(parsed?.reviews ?? []);
      }
      if (messagesRes.ok) {
        const parsed = parsePartnerAdvisorMessages(await messagesRes.json());
        setMessages(parsed?.messages ?? []);
      }
      if (goalsRes.ok) {
        const parsed = parsePartnerAdvisorGoals(await goalsRes.json());
        setGoals(parsed?.goals ?? []);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [goalStatus, queryString, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const scheduleIntroduction = async () => {
    setBusy(true);
    setNotice(null);
    const res = await fetch("/api/partner/advisor/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "schedule_introduction" }),
    });
    if (res.ok) {
      setNotice(labels.introductionScheduled);
      await load();
    } else {
      setNotice(labels.actionFailed);
    }
    setBusy(false);
  };

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!msgBody.trim()) return;
    setBusy(true);
    setNotice(null);
    const res = await fetch("/api/partner/advisor/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: msgSubject, body: msgBody }),
    });
    if (res.ok) {
      setMsgSubject("");
      setMsgBody("");
      setNotice(labels.messageSent);
      await load();
    } else {
      setNotice(labels.actionFailed);
    }
    setBusy(false);
  };

  const requestReview = async () => {
    setBusy(true);
    setNotice(null);
    const res = await fetch("/api/partner/advisor/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_type: "30_day" }),
    });
    if (res.ok) {
      setNotice(labels.reviewRequested);
      await load();
    } else {
      setNotice(labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading && !overview) {
    return (
      <div className="space-y-3">
        <AipifyLoader centered />
        <p className="text-center text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (denied) {
    return (
      <PlatformEmptyState title={labels.accessDenied} message={labels.errorMessage} />
    );
  }

  if (error || !overview) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const partner = overview.partner_info;
  const advisor = overview.advisor;
  const canWrite = overview.can_write ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{labels.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{labels.subtitle}</p>
      </div>

      {notice && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          {notice}
        </p>
      )}

      <section className="flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select
          value={healthFilter}
          onChange={(e) => setHealthFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">{labels.filterHealth}</option>
          <option value="excellent">{healthLabel(labels, "excellent")}</option>
          <option value="healthy">{healthLabel(labels, "healthy")}</option>
          <option value="needs_attention">{healthLabel(labels, "needs_attention")}</option>
          <option value="at_risk">{healthLabel(labels, "at_risk")}</option>
        </select>
        <select
          value={messageSource}
          onChange={(e) => setMessageSource(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">{labels.filterMessageSource}</option>
          <option value="advisor">{messageSourceLabel(labels, "advisor")}</option>
          <option value="companion">{messageSourceLabel(labels, "companion")}</option>
          <option value="system">{messageSourceLabel(labels, "system")}</option>
          <option value="milestone">{messageSourceLabel(labels, "milestone")}</option>
        </select>
        <select
          value={goalStatus}
          onChange={(e) => setGoalStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">{labels.filterGoalStatus}</option>
          <option value="active">{goalStatusLabel(labels, "active")}</option>
          <option value="completed">{goalStatusLabel(labels, "completed")}</option>
          <option value="at_risk">{goalStatusLabel(labels, "at_risk")}</option>
        </select>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={labels.partnerHealthScore}
          value={`${overview.health_score_pct}% · ${healthLabel(labels, overview.health_score_label)}`}
        />
        <MetricCard label={labels.partnerReadinessScore} value={`${overview.readiness_score_pct}%`} />
        <MetricCard label={labels.upcomingReviews} value={overview.upcoming_reviews.length} />
        <MetricCard label={labels.advisorMessages} value={messages.length} />
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">{labels.partnerInfoTitle}</h3>
          {partner && (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">{labels.filterTier}</dt>
                <dd className="font-medium text-slate-900">{partner.org_name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{labels.joinedDate}</dt>
                <dd className="text-slate-900">
                  {partner.joined_date ? new Date(partner.joined_date).toLocaleDateString() : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{labels.filterCountry}</dt>
                <dd className="text-slate-900">{partner.country_code || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{labels.assignedAdvisor}</dt>
                <dd className="text-slate-900">{advisor?.display_name ?? "—"}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="text-slate-500">{labels.partnerHealthScore}</dt>
                <dd>
                  <HealthBadge labels={labels} value={overview.health_score_label} />
                </dd>
              </div>
            </dl>
          )}
          {overview.recommendations.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-900">{labels.recommendedActions}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {overview.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">{labels.advisorCardTitle}</h3>
          {advisor ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-200 text-lg font-semibold text-indigo-900">
                  {advisor.display_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{advisor.display_name}</p>
                  <p className="text-sm text-slate-600">{advisor.role_title}</p>
                  <p className="mt-1 text-xs text-indigo-800">
                    {advisorTypeLabel(labels, advisor.advisor_type)}
                  </p>
                </div>
              </div>
              <dl className="grid gap-2 text-sm">
                <div>
                  <dt className="text-slate-500">{labels.languagesSpoken}</dt>
                  <dd className="text-slate-900">{advisor.languages.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{labels.advisorAvailability}</dt>
                  <dd className="text-slate-900">
                    {availabilityLabel(labels, advisor.availability_status)}
                    {advisor.availability_note ? ` · ${advisor.availability_note}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">{labels.contactOptions}</dt>
                  <dd className="space-y-1 text-slate-900">
                    {advisor.contact_email && (
                      <p>
                        {labels.emailContact}: {advisor.contact_email}
                      </p>
                    )}
                    {advisor.contact_calendar_url && (
                      <p>{labels.calendarContact}</p>
                    )}
                    {advisor.contact_chat_enabled && <p>{labels.chatContact}</p>}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <MetricCard label={labels.partnersSupported} value={advisor.partners_supported} />
                  <MetricCard
                    label={labels.avgPartnerGrowth}
                    value={`${advisor.avg_partner_growth_pct}%`}
                  />
                  <MetricCard
                    label={labels.partnerRetention}
                    value={`${advisor.partner_retention_pct}%`}
                  />
                </div>
              </dl>
            </div>
          ) : (
            <PlatformEmptyState
              title={overview.empty_state?.title ?? labels.emptyTitle}
              message={overview.empty_state?.message ?? labels.emptyMessage}
              primaryAction={
                canWrite
                  ? {
                      label: overview.empty_state?.cta ?? labels.scheduleIntroduction,
                      onClick: () => void scheduleIntroduction(),
                    }
                  : undefined
              }
            />
          )}
        </section>
      </div>

      {overview.success_plan && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.successPlanTitle}</h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <dt className="text-slate-500">{labels.currentStage}</dt>
              <dd className="font-medium text-slate-900">{overview.success_plan.current_stage}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.nextMilestone}</dt>
              <dd className="font-medium text-slate-900">{overview.success_plan.next_milestone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.estimatedTime}</dt>
              <dd className="text-slate-900">{overview.success_plan.estimated_time}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.expectedOutcome}</dt>
              <dd className="text-slate-900">{overview.success_plan.expected_outcome}</dd>
            </div>
          </dl>
          {overview.success_plan.recommended_actions.length > 0 && (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {overview.success_plan.recommended_actions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {overview.advisor_insights.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.advisorInsightsTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {overview.advisor_insights.map((item) => (
              <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {overview.companion_signals.length > 0 && (
        <section className="rounded-xl border border-violet-100 bg-violet-50/40 p-6">
          <h3 className="font-semibold text-slate-900">{labels.companionAdvisorTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {overview.companion_signals.map((signal) => (
              <li key={signal.id} className="rounded-lg bg-white/80 px-3 py-2">
                {signal.summary}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">{labels.reviewCenterTitle}</h3>
            {canWrite && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void requestReview()}
                className="text-sm font-medium text-indigo-700 hover:underline disabled:opacity-50"
              >
                {labels.requestReview}
              </button>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{labels.filterAll}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reviews.map((review) => (
                <li key={review.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-slate-900">
                      {reviewTypeLabel(labels, review.review_type)}
                    </span>
                    <span className="text-slate-500">
                      {reviewStatusLabel(labels, review.review_status)}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">{review.scheduled_date}</p>
                  {review.advisor_notes && (
                    <p className="mt-2 text-slate-700">
                      <span className="font-medium">{labels.advisorNotes}: </span>
                      {review.advisor_notes}
                    </p>
                  )}
                  {review.recommendations.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-slate-600">
                      {review.recommendations.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                  {review.action_items.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                      {labels.actionItems}: {review.action_items.join(" · ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.goalsTitle}</h3>
          {goals.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{labels.filterAll}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {goals.map((goal) => (
                <li key={goal.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-slate-900">{goal.title}</span>
                    <span className="text-slate-500">{goalTypeLabel(labels, goal.goal_type)}</span>
                  </div>
                  <p className="mt-1 text-slate-600">{goal.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {labels.progress}: {goal.current_value}/{goal.target_value} ·{" "}
                    {goalStatusLabel(labels, goal.goal_status)}
                    {goal.due_date ? ` · ${labels.dueDate}: ${goal.due_date}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">{labels.messageCenterTitle}</h3>
        {messages.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{labels.filterAll}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {messages.map((msg) => (
              <li key={msg.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium text-slate-900">{msg.subject}</span>
                  <span className="text-xs text-slate-500">
                    {messageSourceLabel(labels, msg.message_source)} ·{" "}
                    {messageTypeLabel(labels, msg.message_type)}
                  </span>
                </div>
                <p className="mt-1 text-slate-600">{msg.body}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {msg.sender_name} · {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
                </p>
              </li>
            ))}
          </ul>
        )}

        {canWrite && advisor && (
          <form onSubmit={sendMessage} className="mt-6 space-y-3 border-t border-slate-100 pt-6">
            <h4 className="text-sm font-semibold text-slate-900">{labels.sendMessage}</h4>
            <input
              value={msgSubject}
              onChange={(e) => setMsgSubject(e.target.value)}
              placeholder={labels.messageSubject}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <textarea
              value={msgBody}
              onChange={(e) => setMsgBody(e.target.value)}
              placeholder={labels.messageBody}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-50"
            >
              {labels.sendMessage}
            </button>
          </form>
        )}
      </section>

      {overview.journey.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.journeyTitle}</h3>
          <ul className="mt-4 space-y-3">
            {overview.journey.map((item) => (
              <li key={item.id} className="flex gap-3 text-sm">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-slate-600">{item.summary}</p>
                  <p className="text-xs text-slate-400">
                    {item.achieved_at ? new Date(item.achieved_at).toLocaleDateString() : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-slate-900">{labels.faqTitle}</h3>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhatIs}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqWhatIsAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqRealPerson}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqRealPersonAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqHealthScore}</dt>
            <dd className="mt-1 text-slate-600">{labels.faqHealthScoreAnswer}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
