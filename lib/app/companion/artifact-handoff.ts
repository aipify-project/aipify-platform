export type ArtifactHandoffPreviewResponse = {
  ok: boolean;
  preview?: {
    provider_key: string;
    attachment_id: string;
    conversation_id: string;
    filename: string;
    mime_type: string;
    category: string;
    byte_size: number;
    handoff_action: string;
    adapter_readiness: string;
  };
  handoff?: {
    status: string;
  };
  connection_connected?: boolean;
  error?: string;
};

export type ArtifactHandoffExecuteResponse = {
  ok: boolean;
  status: string;
  external_reference: string | null;
  open_url: string | null;
  failure_code: string | null;
  audited?: boolean;
  error?: string;
};

export async function fetchArtifactHandoffPreview(input: {
  providerKey: string;
  attachmentId: string;
  conversationId: string;
}): Promise<ArtifactHandoffPreviewResponse> {
  const params = new URLSearchParams({
    provider: input.providerKey,
    attachment_id: input.attachmentId,
    conversation_id: input.conversationId,
  });
  const res = await fetch(`/api/aipify/companion/artifact-handoff/preview?${params}`);
  return (await res.json()) as ArtifactHandoffPreviewResponse;
}

export async function executeArtifactHandoff(input: {
  providerKey: string;
  attachmentId: string;
  conversationId: string;
  consentGranted: boolean;
}): Promise<ArtifactHandoffExecuteResponse> {
  const res = await fetch("/api/aipify/companion/artifact-handoff/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider_key: input.providerKey,
      attachment_id: input.attachmentId,
      conversation_id: input.conversationId,
      consent_granted: input.consentGranted,
    }),
  });
  return (await res.json()) as ArtifactHandoffExecuteResponse;
}

export async function startCanvaOAuthConnect(): Promise<{ ok: boolean; authorize_url?: string }> {
  const res = await fetch("/api/app-portal/integrations/canva/oauth/start");
  return (await res.json()) as { ok: boolean; authorize_url?: string };
}
