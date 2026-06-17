const API_PREFIX = "/api/desktop";

export type CompanionProfile = {
  has_customer: boolean;
  profile?: {
    first_run_complete?: boolean;
    locale?: string;
    timezone?: string;
  };
};

export type CompanionBriefing = {
  greeting?: string;
  headline?: string;
  summary?: string;
};

export type CompanionHomeBundle = {
  profile: CompanionProfile;
  briefing: CompanionBriefing;
  tasks: { items: Array<{ title?: string }> };
  notifications: { items: Array<{ title?: string }> };
};

export async function fetchCompanionProfile(
  baseUrl: string,
  sessionToken: string
): Promise<CompanionProfile> {
  const res = await fetch(`${baseUrl}${API_PREFIX}/profile`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<CompanionProfile>;
}

export async function fetchCompanionBriefing(
  baseUrl: string,
  sessionToken: string
): Promise<CompanionBriefing> {
  const res = await fetch(`${baseUrl}${API_PREFIX}/briefing`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<CompanionBriefing>;
}

export async function fetchCompanionTasks(
  baseUrl: string,
  sessionToken: string
): Promise<{ items: Array<{ title?: string }> }> {
  const res = await fetch(`${baseUrl}${API_PREFIX}/tasks`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ items: Array<{ title?: string }> }>;
}

export async function fetchCompanionNotifications(
  baseUrl: string,
  sessionToken: string
): Promise<{ items: Array<{ title?: string }> }> {
  const res = await fetch(`${baseUrl}${API_PREFIX}/notifications`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ items: Array<{ title?: string }> }>;
}

export async function saveCompanionPreferences(
  baseUrl: string,
  sessionToken: string,
  patch: Record<string, unknown>
): Promise<void> {
  await fetch(`${baseUrl}${API_PREFIX}/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(patch),
  });
}

export async function loadCompanionHome(
  baseUrl: string,
  sessionToken: string
): Promise<CompanionHomeBundle> {
  const [profile, briefing, tasks, notifications] = await Promise.all([
    fetchCompanionProfile(baseUrl, sessionToken),
    fetchCompanionBriefing(baseUrl, sessionToken),
    fetchCompanionTasks(baseUrl, sessionToken),
    fetchCompanionNotifications(baseUrl, sessionToken),
  ]);
  return { profile, briefing, tasks, notifications };
}
