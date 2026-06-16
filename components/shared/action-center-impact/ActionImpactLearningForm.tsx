"use client";

import { useState } from "react";
import type { ActionImpactLabels, ImpactLearningFeedback } from "@/lib/action-center-impact";

type ActionImpactLearningFormProps = {
  actionId: string;
  labels: ActionImpactLabels;
  onSubmitted?: () => void;
};

export function ActionImpactLearningForm({
  actionId,
  labels,
  onSubmitted,
}: ActionImpactLearningFormProps) {
  const [actualOutcome, setActualOutcome] = useState("");
  const [userSatisfaction, setUserSatisfaction] =
    useState<ImpactLearningFeedback["user_satisfaction"]>("neutral");
  const [goalAchievement, setGoalAchievement] =
    useState<ImpactLearningFeedback["goal_achievement"]>("partially");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!actualOutcome.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/aipify/actions/${actionId}/impact/learning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actual_outcome: actualOutcome.trim(),
          user_satisfaction: userSatisfaction,
          goal_achievement: goalAchievement,
          lessons_learned: lessonsLearned.trim(),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        onSubmitted?.();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        {labels.learningLoop.submitted}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">{labels.learningLoop.intro}</p>
      <label className="block text-sm">
        <span className="font-medium text-gray-800">{labels.learningLoop.actualOutcome}</span>
        <textarea
          value={actualOutcome}
          onChange={(e) => setActualOutcome(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-gray-800">{labels.learningLoop.userSatisfaction}</span>
        <select
          value={userSatisfaction}
          onChange={(e) =>
            setUserSatisfaction(e.target.value as ImpactLearningFeedback["user_satisfaction"])
          }
          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        >
          {Object.entries(labels.learningLoop.satisfaction).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-medium text-gray-800">{labels.learningLoop.goalAchievement}</span>
        <select
          value={goalAchievement}
          onChange={(e) =>
            setGoalAchievement(e.target.value as ImpactLearningFeedback["goal_achievement"])
          }
          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        >
          {Object.entries(labels.learningLoop.achievement).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="font-medium text-gray-800">{labels.learningLoop.lessonsLearned}</span>
        <textarea
          value={lessonsLearned}
          onChange={(e) => setLessonsLearned(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
      </label>
      <button
        type="button"
        disabled={submitting || !actualOutcome.trim()}
        onClick={() => void handleSubmit()}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {labels.learningLoop.submit}
      </button>
    </div>
  );
}
