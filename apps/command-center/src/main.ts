import { fetchCommandCenter, runQuickAction, STATUS_COLORS } from "./api";
import { greetingForTimezone } from "./greeting";

type AppState = {
  baseUrl: string;
  sessionToken: string;
};

function loadState(): AppState {
  return {
    baseUrl: localStorage.getItem("aipify_base_url") ?? "http://localhost:3001",
    sessionToken: localStorage.getItem("aipify_session_token") ?? "",
  };
}

function saveState(state: AppState) {
  localStorage.setItem("aipify_base_url", state.baseUrl);
  localStorage.setItem("aipify_session_token", state.sessionToken);
}

function renderConfig(state: AppState, onSave: () => void) {
  return `
    <section class="config">
      <h2>Connect to Aipify Core</h2>
      <input id="baseUrl" type="url" placeholder="API base URL" value="${state.baseUrl}" />
      <input id="sessionToken" type="password" placeholder="Desktop session token" value="${state.sessionToken}" />
      <button class="primary" id="saveConfig">Save &amp; refresh</button>
      <p style="font-size:11px;color:#6b7280;margin-top:8px">
        Pair from web: /app/command-center/connect (Business plan+)
      </p>
    </section>
  `;
}

async function renderApp(root: HTMLElement, state: AppState) {
  if (!state.sessionToken) {
    root.innerHTML = renderConfig(state, () => {});
    bindConfig(root, state);
    return;
  }

  try {
    const data = await fetchCommandCenter(state.baseUrl, state.sessionToken);
    const status = data.presence_status ?? "offline";
    const color = STATUS_COLORS[status] ?? STATUS_COLORS.offline;

    const feed = (data.executive_feed ?? [])
      .slice(0, 5)
      .map(
        (e) =>
          `<div class="feed-item"><strong>${e.time_label}</strong> ${e.message}</div>`
      )
      .join("");

    const briefing = data.morning_briefing;
    const bullets = briefing?.bullets?.map((b) => `<li>${b}</li>`).join("") ?? "";

    const notifs = (data.notifications ?? [])
      .slice(0, 4)
      .map((n) => `<div class="notif-item">${n.title}</div>`)
      .join("");

    const actions = (data.quick_actions ?? [])
      .slice(0, 4)
      .map(
        (a) => `<button type="button" data-action="${a.id}">${a.label}</button>`
      )
      .join("");

    root.innerHTML = `
      <header>
        <span class="status-dot" style="background:${color}"></span>
        <h1>Aipify · ${status}</h1>
      </header>
      ${briefing ? `<section><h2>Briefing</h2><p><strong>${greetingForTimezone(String(briefing.timezone ?? "UTC"))}.</strong> ${briefing.headline}</p><ul>${bullets}</ul></section>` : ""}
      <section><h2>Executive feed</h2>${feed || "<p class='feed-item'>No events yet.</p>"}</section>
      <section><h2>Notifications (${data.unread_count ?? 0})</h2>${notifs || "<p class='notif-item'>None</p>"}</section>
      <section><h2>Pending approvals</h2><p>${data.pending_approvals ?? 0}</p></section>
      <section class="actions"><h2>Quick actions</h2>${actions}</section>
      ${renderConfig(state, () => {})}
    `;

    root.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = (btn as HTMLButtonElement).dataset.action;
        if (id) void runQuickAction(state.baseUrl, state.sessionToken, id).then(() => renderApp(root, state));
      });
    });
    bindConfig(root, state);
  } catch {
    root.innerHTML = `
      <p class="error">Could not reach Aipify Core. Check URL and session token.</p>
      ${renderConfig(state, () => {})}
    `;
    bindConfig(root, state);
  }
}

function bindConfig(root: HTMLElement, state: AppState) {
  const save = root.querySelector("#saveConfig");
  save?.addEventListener("click", () => {
    state.baseUrl = (root.querySelector("#baseUrl") as HTMLInputElement).value.trim();
    state.sessionToken = (root.querySelector("#sessionToken") as HTMLInputElement).value.trim();
    saveState(state);
    void renderApp(root, state);
  });
}

const root = document.getElementById("app");
if (root) {
  const state = loadState();
  void renderApp(root, state);
  window.setInterval(() => void renderApp(root, state), 60_000);
}
