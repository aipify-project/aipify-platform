import {
  fetchCompanionProfile,
  loadCompanionHome,
  saveCompanionPreferences,
} from "./companion-api";
import { fetchCommandCenter, STATUS_COLORS } from "./api";
import { greetingForTimezone } from "./greeting";
import {
  defaultHotkey,
  isFirstRunComplete,
  loadOfflineItems,
  markFirstRunComplete,
  saveOfflineItem,
} from "./offline";

export type AppState = {
  baseUrl: string;
  sessionToken: string;
  view: "home" | "briefings" | "tasks" | "notifications" | "focus" | "settings";
};

export function loadState(): AppState {
  return {
    baseUrl: localStorage.getItem("aipify_base_url") ?? "http://localhost:3001",
    sessionToken: localStorage.getItem("aipify_session_token") ?? "",
    view: (localStorage.getItem("aipify_companion_view") as AppState["view"]) ?? "home",
  };
}

export function saveState(state: AppState) {
  localStorage.setItem("aipify_base_url", state.baseUrl);
  localStorage.setItem("aipify_session_token", state.sessionToken);
  localStorage.setItem("aipify_companion_view", state.view);
}

function navItem(id: AppState["view"], label: string, active: boolean) {
  return `<button type="button" class="nav-item${active ? " active" : ""}" data-view="${id}">${label}</button>`;
}

function renderConfig(state: AppState) {
  return `
    <section class="config">
      <h2>Connect to Aipify</h2>
      <input id="baseUrl" type="url" placeholder="API base URL" value="${state.baseUrl}" />
      <input id="sessionToken" type="password" placeholder="Desktop session token" value="${state.sessionToken}" />
      <button class="primary" id="saveConfig">Save &amp; refresh</button>
      <p class="hint">Pair from web: /app/command-center/connect (Business plan+)</p>
    </section>
  `;
}

function renderFirstRun(state: AppState) {
  return `
    <section class="first-run">
      <h2>Hello. I am Aipify.</h2>
      <p>I will help you organize information, identify priorities and assist with daily work.</p>
      <p>Before we begin, I would like to learn how you prefer to work.</p>
      <label>Language<input id="frLocale" value="en" /></label>
      <label>Time zone<input id="frTz" value="Europe/Oslo" /></label>
      <button class="primary" id="finishFirstRun">Finish setup</button>
    </section>
    ${renderConfig(state)}
  `;
}

export async function renderCompanionApp(root: HTMLElement, state: AppState) {
  if (!state.sessionToken) {
    root.innerHTML = renderConfig(state);
    bindConfig(root, state, () => void renderCompanionApp(root, state));
    return;
  }

  if (!isFirstRunComplete()) {
    try {
      const profile = await fetchCompanionProfile(state.baseUrl, state.sessionToken);
      if (!profile.profile?.first_run_complete) {
        root.innerHTML = renderFirstRun(state);
        bindConfig(root, state, () => void renderCompanionApp(root, state));
        root.querySelector("#finishFirstRun")?.addEventListener("click", () => {
          void (async () => {
            await saveCompanionPreferences(state.baseUrl, state.sessionToken, {
              profile: {
                locale: (root.querySelector("#frLocale") as HTMLInputElement).value,
                timezone: (root.querySelector("#frTz") as HTMLInputElement).value,
                first_run_complete: true,
                first_run_intro_seen: true,
              },
            });
            markFirstRunComplete();
            await renderCompanionApp(root, state);
          })();
        });
        return;
      }
      markFirstRunComplete();
    } catch {
      root.innerHTML = `<p class="error">Could not reach Aipify Core.</p>${renderConfig(state)}`;
      bindConfig(root, state, () => void renderCompanionApp(root, state));
      return;
    }
  }

  try {
    const [bundle, cc] = await Promise.all([
      loadCompanionHome(state.baseUrl, state.sessionToken),
      fetchCommandCenter(state.baseUrl, state.sessionToken).catch(() => null),
    ]);

    const status = cc?.presence_status ?? "offline";
    const color = STATUS_COLORS[status] ?? STATUS_COLORS.offline;
    const greeting = bundle.briefing.greeting ?? greetingForTimezone("UTC");
    const offline = loadOfflineItems();
    const hotkey = defaultHotkey();

    const tasks = bundle.tasks.items
      .slice(0, 5)
      .map((t) => `<li>${t.title ?? "Task"}</li>`)
      .join("");
    const notifs = bundle.notifications.items
      .slice(0, 4)
      .map((n) => `<div class="notif-item">${n.title}</div>`)
      .join("");

    root.innerHTML = `
      <header>
        <span class="status-dot" style="background:${color}"></span>
        <h1>Aipify Desktop Companion</h1>
      </header>
      <nav class="companion-nav">
        ${navItem("home", "Home", state.view === "home")}
        ${navItem("briefings", "Briefings", state.view === "briefings")}
        ${navItem("tasks", "Tasks", state.view === "tasks")}
        ${navItem("notifications", "Notifications", state.view === "notifications")}
        ${navItem("focus", "Focus", state.view === "focus")}
        ${navItem("settings", "Settings", state.view === "settings")}
      </nav>
      ${state.view === "home" ? `
        <section><h2>${greeting}</h2><p><strong>Today's Focus</strong> ${bundle.briefing.headline ?? bundle.briefing.summary ?? ""}</p></section>
        <section><h2>Tasks</h2><ul>${tasks || "<li>None</li>"}</ul></section>
        <section><h2>Quick Actions</h2>
          <div class="actions">
            <button type="button" data-quick="note">Create Note</button>
            <button type="button" data-quick="task">Create Task</button>
            <button type="button" data-quick="focus">Start Focus</button>
            <button type="button" data-quick="ask">Ask Aipify</button>
          </div>
        </section>
      ` : ""}
      ${state.view === "briefings" ? `<section><h2>Daily Briefing</h2><p>${bundle.briefing.summary ?? bundle.briefing.headline ?? ""}</p></section>` : ""}
      ${state.view === "tasks" ? `<section><h2>Tasks</h2><ul>${tasks || "<li>None</li>"}</ul></section>` : ""}
      ${state.view === "notifications" ? `<section><h2>Notifications</h2>${notifs || "<p>None</p>"}</section>` : ""}
      ${state.view === "focus" ? `<section><h2>Focus Mode</h2><p>Reduce distractions. Select a priority and stay with one task.</p></section>` : ""}
      ${state.view === "settings" ? `
        <section><h2>Settings</h2>
          <p class="hint">Global hotkey: ${hotkey} (configurable in web settings)</p>
          <p class="hint">${offline.length} offline item(s) cached locally.</p>
        </section>
      ` : ""}
      <section class="sidebar-hint"><h2>Companion</h2><p>Ask Aipify · Briefings · Suggestions · Follow-ups</p></section>
      ${renderConfig(state)}
    `;

    root.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = (btn as HTMLButtonElement).dataset.view as AppState["view"];
        saveState(state);
        void renderCompanionApp(root, state);
      });
    });

    root.querySelectorAll("[data-quick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = (btn as HTMLButtonElement).dataset.quick;
        if (kind === "note" || kind === "task") {
          saveOfflineItem({ type: kind === "note" ? "note" : "task", title: `New ${kind}`, body: "" });
        }
        if (kind === "focus") {
          state.view = "focus";
          saveState(state);
        }
        void renderCompanionApp(root, state);
      });
    });

    bindConfig(root, state, () => void renderCompanionApp(root, state));
  } catch {
    root.innerHTML = `<p class="error">Could not reach Aipify Core.</p>${renderConfig(state)}`;
    bindConfig(root, state, () => void renderCompanionApp(root, state));
  }
}

function bindConfig(root: HTMLElement, state: AppState, refresh: () => void) {
  root.querySelector("#saveConfig")?.addEventListener("click", () => {
    state.baseUrl = (root.querySelector("#baseUrl") as HTMLInputElement).value.trim();
    state.sessionToken = (root.querySelector("#sessionToken") as HTMLInputElement).value.trim();
    saveState(state);
    refresh();
  });
}
