export * from "./types";
export * from "./parse";
export * from "./client";
export * from "./detection";
export * from "./developer-detection";
export * from "./developer-guidance";
export * from "./retrieve";
// import-seed uses node:fs — import only from ./import-seed in server routes

export const KC_MODULE_PATH =
  "aipify-core/modules/knowledge-center/phase-55-self-knowledge-knowledge-center.txt";

export const KC_CORE_PRINCIPLE =
  "Search Knowledge Center first. Answer only from known content. Create a Knowledge Gap when confidence is low. Never invent answers about Aipify.";

export const KC_UPGRADE_WORDING =
  "Knowledge Center is available in Aipify Growth and above because it lets Aipify support itself with trusted, editable documentation.";
