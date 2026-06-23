import {
  MICROSOFT365_GRAPH_BASE,
  MICROSOFT365_OAUTH_TOKEN_URL,
  type Microsoft365ApplicationKey,
  defaultMicrosoft365CreateFilename,
  defaultMicrosoft365CreateMime,
} from "./connect-capabilities-audit";

export type Microsoft365OAuthTokenBundle = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

export type Microsoft365AccountProfile = {
  id: string;
  display_name: string;
  email: string | null;
};

export type Microsoft365DriveItemResult = {
  ok: boolean;
  item_id: string | null;
  name: string | null;
  web_url: string | null;
  edit_url: string | null;
  status: "success" | "failed";
  failure_code: string | null;
};

export type Microsoft365DiscoverySnapshot = {
  ok: boolean;
  account: Microsoft365AccountProfile | null;
  drive_available: boolean;
  capabilities: readonly string[];
  failure_code: string | null;
};

function sanitizeOneDrivePathSegment(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "_").trim() || "Aipify";
}

function encodeOneDrivePath(filename: string): string {
  return encodeURIComponent(sanitizeOneDrivePathSegment(filename)).replace(/%2F/g, "/");
}

export async function exchangeMicrosoft365AuthorizationCode(input: {
  code: string;
  code_verifier: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}): Promise<Microsoft365OAuthTokenBundle> {
  const body = new URLSearchParams({
    client_id: input.client_id,
    client_secret: input.client_secret,
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: input.redirect_uri,
    code_verifier: input.code_verifier,
  });

  const response = await fetch(MICROSOFT365_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`microsoft365_token_exchange_failed:${response.status}`);
  }

  return (await response.json()) as Microsoft365OAuthTokenBundle;
}

function mapDriveItem(payload: Record<string, unknown>): Microsoft365DriveItemResult {
  const itemId = typeof payload.id === "string" ? payload.id : null;
  const name = typeof payload.name === "string" ? payload.name : null;
  const webUrl = typeof payload.webUrl === "string" ? payload.webUrl : null;
  return {
    ok: Boolean(itemId && webUrl),
    item_id: itemId,
    name,
    web_url: webUrl,
    edit_url: webUrl,
    status: itemId && webUrl ? "success" : "failed",
    failure_code: itemId && webUrl ? null : "graph_drive_item_missing",
  };
}

export async function fetchMicrosoft365AccountProfile(
  accessToken: string,
): Promise<Microsoft365AccountProfile | null> {
  const response = await fetch(`${MICROSOFT365_GRAPH_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as Record<string, unknown>;
  const id = typeof payload.id === "string" ? payload.id : null;
  if (!id) return null;
  const displayName =
    typeof payload.displayName === "string" && payload.displayName.trim()
      ? payload.displayName.trim()
      : "Microsoft 365 account";
  const email =
    typeof payload.mail === "string"
      ? payload.mail
      : typeof payload.userPrincipalName === "string"
        ? payload.userPrincipalName
        : null;
  return { id, display_name: displayName, email };
}

export async function probeMicrosoft365DriveAvailable(accessToken: string): Promise<boolean> {
  const response = await fetch(`${MICROSOFT365_GRAPH_BASE}/me/drive`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.ok;
}

export async function buildMicrosoft365DiscoverySnapshot(
  accessToken: string,
): Promise<Microsoft365DiscoverySnapshot> {
  const account = await fetchMicrosoft365AccountProfile(accessToken);
  if (!account) {
    return {
      ok: false,
      account: null,
      drive_available: false,
      capabilities: [],
      failure_code: "graph_account_unavailable",
    };
  }

  const driveAvailable = await probeMicrosoft365DriveAvailable(accessToken);
  if (!driveAvailable) {
    return {
      ok: false,
      account,
      drive_available: false,
      capabilities: [],
      failure_code: "graph_drive_unavailable",
    };
  }

  return {
    ok: true,
    account,
    drive_available: true,
    capabilities: [
      "document.create",
      "spreadsheet.create",
      "presentation.create",
      "document.open",
      "spreadsheet.open",
      "presentation.open",
      "save.onedrive",
      "export.onedrive",
      "artifact.handoff.onedrive_upload",
    ],
    failure_code: null,
  };
}

export async function uploadMicrosoft365DriveContent(input: {
  access_token: string;
  filename: string;
  mime_type: string;
  file_bytes: Buffer;
  folder?: string;
}): Promise<Microsoft365DriveItemResult> {
  const folder = input.folder ? `${encodeOneDrivePath(input.folder)}/` : "";
  const path = `${folder}${encodeOneDrivePath(input.filename)}`;
  const response = await fetch(`${MICROSOFT365_GRAPH_BASE}/me/drive/root:/${path}:/content`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${input.access_token}`,
      "Content-Type": input.mime_type || "application/octet-stream",
    },
    body: new Uint8Array(input.file_bytes),
  });

  if (!response.ok) {
    return {
      ok: false,
      item_id: null,
      name: input.filename,
      web_url: null,
      edit_url: null,
      status: "failed",
      failure_code: `graph_upload_failed:${response.status}`,
    };
  }

  const payload = (await response.json()) as Record<string, unknown>;
  return mapDriveItem(payload);
}

export async function createMicrosoft365OfficeFile(input: {
  access_token: string;
  application_key: Microsoft365ApplicationKey;
  filename?: string;
}): Promise<Microsoft365DriveItemResult> {
  const filename = input.filename?.trim() || defaultMicrosoft365CreateFilename(input.application_key);
  const mimeType = defaultMicrosoft365CreateMime(input.application_key);

  const createResponse = await fetch(`${MICROSOFT365_GRAPH_BASE}/me/drive/root/children`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: filename,
      file: {},
      "@microsoft.graph.conflictBehavior": "rename",
    }),
  });

  if (!createResponse.ok) {
    return {
      ok: false,
      item_id: null,
      name: filename,
      web_url: null,
      edit_url: null,
      status: "failed",
      failure_code: `graph_create_failed:${createResponse.status}`,
    };
  }

  const created = (await createResponse.json()) as Record<string, unknown>;
  const itemId = typeof created.id === "string" ? created.id : null;
  if (!itemId) {
    return {
      ok: false,
      item_id: null,
      name: filename,
      web_url: null,
      edit_url: null,
      status: "failed",
      failure_code: "graph_create_missing_item_id",
    };
  }

  const contentResponse = await fetch(
    `${MICROSOFT365_GRAPH_BASE}/me/drive/items/${itemId}/content`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${input.access_token}`,
        "Content-Type": mimeType,
      },
      body: new Uint8Array(Buffer.alloc(0)),
    },
  );

  if (!contentResponse.ok) {
    const fallback = mapDriveItem(created);
    return fallback.ok
      ? fallback
      : {
          ok: false,
          item_id: itemId,
          name: filename,
          web_url: null,
          edit_url: null,
          status: "failed",
          failure_code: `graph_create_content_failed:${contentResponse.status}`,
        };
  }

  const uploaded = (await contentResponse.json()) as Record<string, unknown>;
  return mapDriveItem(uploaded);
}

export async function openMicrosoft365DriveItem(input: {
  access_token: string;
  item_id: string;
}): Promise<Microsoft365DriveItemResult> {
  const response = await fetch(`${MICROSOFT365_GRAPH_BASE}/me/drive/items/${input.item_id}`, {
    headers: { Authorization: `Bearer ${input.access_token}` },
  });

  if (!response.ok) {
    return {
      ok: false,
      item_id: input.item_id,
      name: null,
      web_url: null,
      edit_url: null,
      status: "failed",
      failure_code: `graph_open_failed:${response.status}`,
    };
  }

  const payload = (await response.json()) as Record<string, unknown>;
  return mapDriveItem(payload);
}
