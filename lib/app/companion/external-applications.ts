import type { CompanionArtifactCategory } from "@/lib/companion-runtime/artifact-context/types";
import type {
  ExternalApplicationDiscoveryResult,
  ExternalApplicationOperation,
} from "@/lib/companion-runtime/external-application-orchestration";

export type ExternalApplicationDiscoveryResponse = {
  ok: boolean;
  workspace?: string;
  operation?: ExternalApplicationOperation;
  discovery?: ExternalApplicationDiscoveryResult;
  selection?: {
    selected: ExternalApplicationDiscoveryResult["applications"][number] | null;
    candidates: ExternalApplicationDiscoveryResult["applications"];
    requires_user_selection: boolean;
  };
  error?: string;
};

export async function fetchExternalApplicationDiscovery(input: {
  category: CompanionArtifactCategory;
  mimeType: string;
  operation?: ExternalApplicationOperation;
}): Promise<ExternalApplicationDiscoveryResponse> {
  const params = new URLSearchParams({
    category: input.category,
    mime_type: input.mimeType,
    operation: input.operation ?? "handoff",
  });
  const res = await fetch(`/api/aipify/companion/external-applications/discover?${params}`);
  return (await res.json()) as ExternalApplicationDiscoveryResponse;
}
