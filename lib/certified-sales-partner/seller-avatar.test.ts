import assert from "node:assert/strict";
import test from "node:test";
import { adminSellerAvatarPath, extractAvatarUrlFromMetadata, safeAvatarUrl, sellerInitials } from "./seller-avatar";

const ID = "11111111-2222-3333-4444-555555555555";

test("seller-portal pointer maps to the admin avatar route only with a partner id", () => {
  assert.equal(safeAvatarUrl("/api/partners/profile/avatar?v=7", ID), adminSellerAvatarPath(ID, "7"));
  assert.equal(safeAvatarUrl("/api/partners/profile/avatar?v=7"), null);
});

test("only the admin route and https URLs are accepted", () => {
  assert.equal(safeAvatarUrl(adminSellerAvatarPath(ID, 3)), adminSellerAvatarPath(ID, 3));
  assert.equal(safeAvatarUrl("https://cdn.example.com/a.png"), "https://cdn.example.com/a.png");
  assert.equal(safeAvatarUrl("http://cdn.example.com/a.png"), null);
  assert.equal(safeAvatarUrl("javascript:alert(1)"), null);
  assert.equal(safeAvatarUrl("data:image/png;base64,AAAA"), null);
  assert.equal(safeAvatarUrl("/api/other?v=1"), null);
  assert.equal(safeAvatarUrl(42), null);
  assert.equal(safeAvatarUrl("  "), null);
});

test("extractAvatarUrlFromMetadata prefers avatar_url, then profile_image_url, then picture", () => {
  assert.equal(
    extractAvatarUrlFromMetadata({ picture: "https://x.example/p.png", profile_image_url: "https://x.example/i.png" }),
    "https://x.example/i.png",
  );
  assert.equal(
    extractAvatarUrlFromMetadata({ avatar_url: "javascript:x", picture: "https://x.example/p.png" }),
    "https://x.example/p.png",
  );
  assert.equal(extractAvatarUrlFromMetadata({ avatar_url: "/api/partners/profile/avatar?v=2" }, ID), adminSellerAvatarPath(ID, "2"));
  assert.equal(extractAvatarUrlFromMetadata(null), null);
  assert.equal(extractAvatarUrlFromMetadata([]), null);
});

test("sellerInitials never returns an empty string", () => {
  assert.equal(sellerInitials("Ada Lovelace Byron"), "AB");
  assert.equal(sellerInitials("ola"), "O");
  assert.equal(sellerInitials("  "), "?");
  assert.equal(sellerInitials(null, "–"), "–");
});
