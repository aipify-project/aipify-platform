import type { WebsiteKompisFaqPublishPlan } from "@/lib/website-kompis-faq/safety";

export type FaqSavedRow = { id: string; status: string };

export type FaqPublishFlowResult =
  | { outcome: "published"; id: string; status: "published" }
  | { outcome: "revised"; id: string; status: "published" }
  | { outcome: "draft_saved_publish_failed"; id: string; status: "draft" }
  | { outcome: "blocked" }
  | { outcome: "save_failed" };

/**
 * One user action. The id used for publish is the id returned by save,
 * never a React state value captured before the save finished.
 */
export async function runFaqPublishFlow(input: {
  plan: WebsiteKompisFaqPublishPlan;
  save: () => Promise<FaqSavedRow | null>;
  publish: (id: string) => Promise<{ ok: boolean; id?: string; status?: string }>;
}): Promise<FaqPublishFlowResult> {
  if (input.plan === "blocked") return { outcome: "blocked" };

  const saved = await input.save();
  if (!saved?.id) return { outcome: "save_failed" };

  if (input.plan === "revise_published") {
    if (saved.status !== "published") return { outcome: "save_failed" };
    return { outcome: "revised", id: saved.id, status: "published" };
  }

  const published = await input.publish(saved.id);
  if (!published.ok || published.status !== "published" || published.id !== saved.id) {
    return { outcome: "draft_saved_publish_failed", id: saved.id, status: "draft" };
  }
  return { outcome: "published", id: saved.id, status: "published" };
}
