import { loadState, renderCompanionApp } from "./companion-app";

const root = document.getElementById("app");
if (root) {
  const state = loadState();
  void renderCompanionApp(root, state);
  window.setInterval(() => void renderCompanionApp(root, state), 60_000);
}
