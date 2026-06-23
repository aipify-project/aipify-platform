import {
  CANVA_CONNECT_API_BASE,
  CANVA_OAUTH_TOKEN_URL,
} from "./connect-capabilities-audit";

export type CanvaOAuthTokenBundle = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
};

export type CanvaAssetUploadJob = {
  job_id: string;
  status: "in_progress" | "success" | "failed";
  asset_id?: string;
  error?: { code?: string; message?: string };
};

export type CanvaDesignImportJob = {
  job_id: string;
  status: "in_progress" | "success" | "failed";
  designs?: Array<{ id: string; title?: string; urls?: { edit_url?: string; view_url?: string } }>;
  error?: { code?: string; message?: string };
};

function encodeBase64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

export async function exchangeCanvaAuthorizationCode(input: {
  code: string;
  code_verifier: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}): Promise<CanvaOAuthTokenBundle> {
  const credentials = Buffer.from(`${input.client_id}:${input.client_secret}`, "utf8").toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: input.code,
    code_verifier: input.code_verifier,
    redirect_uri: input.redirect_uri,
  });

  const response = await fetch(CANVA_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`canva_token_exchange_failed:${response.status}`);
  }

  return (await response.json()) as CanvaOAuthTokenBundle;
}

export async function uploadCanvaAsset(input: {
  access_token: string;
  filename: string;
  mime_type: string;
  file_bytes: Buffer;
}): Promise<CanvaAssetUploadJob> {
  const metadata = JSON.stringify({ name_base64: encodeBase64(input.filename) });
  const response = await fetch(`${CANVA_CONNECT_API_BASE}/asset-uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.access_token}`,
      "Content-Type": "application/octet-stream",
      "Asset-Upload-Metadata": metadata,
    },
    body: new Uint8Array(input.file_bytes),
  });

  const payload = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    return {
      job_id: "",
      status: "failed",
      error: { code: "upload_rejected", message: String(payload.message ?? response.status) },
    };
  }

  const job = payload.job as Record<string, unknown> | undefined;
  const asset = payload.asset as Record<string, unknown> | undefined;
  const jobId = String(job?.id ?? payload.id ?? "");
  const status = String(job?.status ?? payload.status ?? "in_progress") as CanvaAssetUploadJob["status"];

  if (status === "success" && asset?.id) {
    return { job_id: jobId, status: "success", asset_id: String(asset.id) };
  }

  if (jobId) {
    return pollCanvaAssetUploadJob(input.access_token, jobId);
  }

  return { job_id: "", status: "failed", error: { code: "missing_job_id" } };
}

export async function pollCanvaAssetUploadJob(
  accessToken: string,
  jobId: string,
  attempts = 8,
): Promise<CanvaAssetUploadJob> {
  for (let index = 0; index < attempts; index += 1) {
    const response = await fetch(`${CANVA_CONNECT_API_BASE}/asset-uploads/${jobId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payload = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      return {
        job_id: jobId,
        status: "failed",
        error: { code: "poll_failed", message: String(payload.message ?? response.status) },
      };
    }

    const job = payload.job as Record<string, unknown> | undefined;
    const asset = payload.asset as Record<string, unknown> | undefined;
    const status = String(job?.status ?? payload.status ?? "in_progress") as CanvaAssetUploadJob["status"];

    if (status === "success") {
      const assetId = asset?.id ? String(asset.id) : null;
      if (!assetId) {
        return { job_id: jobId, status: "failed", error: { code: "missing_asset_id" } };
      }
      return { job_id: jobId, status: "success", asset_id: assetId };
    }

    if (status === "failed") {
      const error = job?.error as Record<string, unknown> | undefined;
      return {
        job_id: jobId,
        status: "failed",
        error: { code: String(error?.code ?? "upload_failed"), message: String(error?.message ?? "") },
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return { job_id: jobId, status: "failed", error: { code: "upload_timeout" } };
}

export async function importCanvaDesign(input: {
  access_token: string;
  title: string;
  mime_type: string;
  file_bytes: Buffer;
}): Promise<CanvaDesignImportJob> {
  const metadata = JSON.stringify({
    title_base64: encodeBase64(input.title),
    mime_type: input.mime_type,
  });

  const response = await fetch(`${CANVA_CONNECT_API_BASE}/imports`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.access_token}`,
      "Content-Type": "application/octet-stream",
      "Import-Metadata": metadata,
    },
    body: new Uint8Array(input.file_bytes),
  });

  const payload = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    return {
      job_id: "",
      status: "failed",
      error: { code: "import_rejected", message: String(payload.message ?? response.status) },
    };
  }

  const job = payload.job as Record<string, unknown> | undefined;
  const jobId = String(job?.id ?? payload.id ?? "");
  if (!jobId) {
    return { job_id: "", status: "failed", error: { code: "missing_job_id" } };
  }

  return pollCanvaDesignImportJob(input.access_token, jobId);
}

export async function pollCanvaDesignImportJob(
  accessToken: string,
  jobId: string,
  attempts = 10,
): Promise<CanvaDesignImportJob> {
  for (let index = 0; index < attempts; index += 1) {
    const response = await fetch(`${CANVA_CONNECT_API_BASE}/imports/${jobId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payload = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      return {
        job_id: jobId,
        status: "failed",
        error: { code: "poll_failed", message: String(payload.message ?? response.status) },
      };
    }

    const job = payload.job as Record<string, unknown> | undefined;
    const status = String(job?.status ?? payload.status ?? "in_progress") as CanvaDesignImportJob["status"];

    if (status === "success") {
      const designsRaw = (job?.designs ?? payload.designs) as unknown;
      const designs = Array.isArray(designsRaw)
        ? designsRaw.map((entry) => {
            const row = entry as Record<string, unknown>;
            const urls = row.urls as Record<string, unknown> | undefined;
            return {
              id: String(row.id ?? ""),
              title: row.title ? String(row.title) : undefined,
              urls: urls
                ? {
                    edit_url: urls.edit_url ? String(urls.edit_url) : undefined,
                    view_url: urls.view_url ? String(urls.view_url) : undefined,
                  }
                : undefined,
            };
          })
        : [];

      if (designs.length === 0 || !designs[0]?.id) {
        return { job_id: jobId, status: "failed", error: { code: "missing_design_id" } };
      }

      return { job_id: jobId, status: "success", designs };
    }

    if (status === "failed") {
      const error = job?.error as Record<string, unknown> | undefined;
      return {
        job_id: jobId,
        status: "failed",
        error: { code: String(error?.code ?? "import_failed"), message: String(error?.message ?? "") },
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return { job_id: jobId, status: "failed", error: { code: "import_timeout" } };
}

export function buildCanvaAssetLibraryUrl(assetId: string): string {
  return `https://www.canva.com/asset/${assetId}`;
}

export function buildCanvaDesignEditUrl(designId: string): string {
  return `https://www.canva.com/design/${designId}/edit`;
}
