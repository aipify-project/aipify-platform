import { createRoot } from "react-dom/client";
import { WebsiteKompisFaqAdminPanel } from "@/components/app/website-kompis/WebsiteKompisFaqAdminPanel";
import { buildWebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";

type Dict = Record<string, unknown>;

function lookup(dict: Dict, key: string): string {
  const path = key.replace(/^customerApp\./, "").split(".");
  let node: unknown = dict;
  for (const part of path) {
    if (!node || typeof node !== "object") return key;
    node = (node as Dict)[part];
  }
  return typeof node === "string" ? node : key;
}

const locale = new URLSearchParams(window.location.search).get("locale") || "en";
const response = await fetch(`/__fixture/labels?locale=${encodeURIComponent(locale)}`);
const dict = (await response.json()) as Dict;
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <WebsiteKompisFaqAdminPanel labels={buildWebsiteKompisFaqLabels((key) => lookup(dict, key))} embedded />,
  );
}
