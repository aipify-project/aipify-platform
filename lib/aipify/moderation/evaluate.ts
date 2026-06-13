import {
  CRITICAL_STOP_CATEGORIES,
  type ModerationEvaluation,
  type ModerationImageInput,
  type ModerationPolicyContext,
  type ModerationSourceType,
  type ModerationSuggestedAction,
} from "./types";

const AUTO_APPROVE_THRESHOLD = 90;
const AUTO_REJECT_THRESHOLD = 90;
const MANUAL_REVIEW_FLOOR = 50;

function hasCriticalRisk(riskFlags: string[]): boolean {
  return riskFlags.some((flag) =>
    (CRITICAL_STOP_CATEGORIES as readonly string[]).includes(flag)
  );
}

function profileAllowsAdult(ctx: ModerationPolicyContext): boolean {
  return ctx.adult_in_profile_allowed === true;
}

function adultAllowed(ctx: ModerationPolicyContext): boolean {
  if (ctx.is_private_album && ctx.adult_content_allowed !== false) return true;
  if (ctx.is_public_album === false && ctx.adult_content_allowed !== false) return true;
  return ctx.adult_content_allowed === true;
}

function buildReason(
  categories: string[],
  riskFlags: string[],
  sourceType: ModerationSourceType,
  ctx: ModerationPolicyContext
): string {
  if (hasCriticalRisk(riskFlags)) {
    return "The image is flagged with a critical risk category and requires immediate manual review.";
  }
  if (categories.includes("adult_content") && sourceType === "profile_image" && !profileAllowsAdult(ctx)) {
    return "The image appears to contain adult content used as a profile photo, which may not match your profile guidelines.";
  }
  if (categories.includes("spam_advertising")) {
    return "The image appears to be promotional or spam content.";
  }
  if (categories.includes("profile_photo") && riskFlags.length === 0) {
    return "The image appears to be a standard profile photo. No serious risk flags were detected.";
  }
  if (categories.includes("product_image") && sourceType === "marketplace_image") {
    return "The image appears to be a marketplace product photo suitable for review.";
  }
  if (categories.includes("document_verification") && sourceType === "verification_image") {
    return "The image appears to be a verification document and should be reviewed against verification rules.";
  }
  return "Aipify recommends manual review because confidence or policy context requires human judgment.";
}

function inferSuggestedAction(
  decision: ModerationEvaluation["decision"],
  categories: string[],
  riskFlags: string[],
  sourceType: ModerationSourceType,
  ctx: ModerationPolicyContext
): ModerationSuggestedAction | null {
  if (decision === "auto_reject") return "reject";
  if (hasCriticalRisk(riskFlags)) return "escalate";
  if (categories.includes("adult_content") && sourceType === "profile_image" && !profileAllowsAdult(ctx)) {
    return "request_new_upload";
  }
  if (categories.includes("adult_content") && adultAllowed(ctx)) {
    return "move_to_adult_area";
  }
  if (decision === "auto_approve") return "approve";
  return "approve";
}

function inferFromSignals(input: ModerationImageInput): {
  categories: string[];
  riskFlags: string[];
  confidence: number;
} {
  const signals = input.analysis_signals ?? {};
  const categories = [...(signals.detected_categories ?? [])];
  const riskFlags = [...(signals.risk_flags ?? [])];
  let confidence = signals.confidence_hint ?? 72;

  if (categories.length === 0) {
    if (input.source_type === "product_image" || input.source_type === "marketplace_image") {
      categories.push("product_image");
      confidence = Math.max(confidence, 78);
    } else if (input.source_type === "verification_image") {
      categories.push("document_verification");
      confidence = Math.min(confidence, 68);
    } else {
      categories.push("profile_photo");
      confidence = Math.max(confidence, 82);
    }
  }

  if (signals.is_duplicate) {
    categories.push("duplicate");
    confidence = Math.min(confidence, 55);
  }
  if (signals.face_visible === false && input.source_type === "verification_image") {
    categories.push("face_not_visible");
    riskFlags.push("verification_face_missing");
    confidence = Math.min(confidence, 48);
  }

  if (input.is_reported || input.policy_context?.is_reported) {
    confidence = Math.min(confidence, 60);
    if (!riskFlags.includes("user_reported")) riskFlags.push("user_reported");
  }

  return { categories, riskFlags, confidence };
}

export function evaluateModerationImage(input: ModerationImageInput): ModerationEvaluation {
  const ctx = input.policy_context ?? {};
  const { categories, riskFlags, confidence: baseConfidence } = inferFromSignals(input);
  let confidence = baseConfidence;
  let decision: ModerationEvaluation["decision"] = "manual_review";
  let priority: ModerationEvaluation["priority"] = "normal";
  let isHighRisk = false;

  if (hasCriticalRisk(riskFlags)) {
    isHighRisk = true;
    priority = "critical";
    if (confidence >= AUTO_REJECT_THRESHOLD) {
      decision = "auto_reject";
    } else {
      decision = "manual_review";
      confidence = Math.min(confidence, MANUAL_REVIEW_FLOOR + 5);
    }
  } else if (categories.includes("adult_content") && input.source_type === "profile_image" && !profileAllowsAdult(ctx)) {
    decision = "manual_review";
    confidence = Math.min(Math.max(confidence, 55), 85);
    isHighRisk = ctx.explicit_profile_forbidden !== false;
    if (isHighRisk) priority = "high";
  } else if (categories.includes("spam_advertising") || categories.includes("hate_symbols")) {
    decision = confidence >= AUTO_REJECT_THRESHOLD ? "auto_reject" : "manual_review";
    isHighRisk = categories.includes("hate_symbols");
    priority = isHighRisk ? "high" : "normal";
  } else if (
    categories.includes("profile_photo") &&
    riskFlags.length === 0 &&
    confidence >= AUTO_APPROVE_THRESHOLD &&
    input.source_type === "profile_image"
  ) {
    decision = "auto_approve";
  } else if (confidence >= AUTO_APPROVE_THRESHOLD && riskFlags.length === 0 && !input.is_reported) {
    decision = "auto_approve";
  } else if (confidence < MANUAL_REVIEW_FLOOR) {
    decision = "manual_review";
  } else {
    decision = "manual_review";
  }

  const reason_summary = buildReason(categories, riskFlags, input.source_type, ctx);
  const suggested_action = inferSuggestedAction(decision, categories, riskFlags, input.source_type, ctx);

  return {
    decision,
    confidence: Math.max(0, Math.min(100, Math.round(confidence))),
    categories,
    risk_flags: riskFlags,
    reason_summary,
    suggested_action,
    is_high_risk: isHighRisk,
    priority,
  };
}
