import assert from "node:assert/strict";
import { NextResponse } from "next/server";
import { copySupabaseAuthCookies } from "./session-cookies";

const sessionResponse = NextResponse.next();
sessionResponse.cookies.set("sb-access-token", "refreshed-access", {
  path: "/",
  secure: true,
  sameSite: "lax",
  maxAge: 300,
});
sessionResponse.cookies.set("sb-refresh-token", "refreshed-refresh", {
  path: "/",
  secure: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
});

const redirect = NextResponse.redirect("https://app.aipify.ai/login?next=%2Fapp");
copySupabaseAuthCookies(sessionResponse, redirect);

assert.equal(redirect.cookies.get("sb-access-token")?.value, "refreshed-access");
assert.equal(redirect.cookies.get("sb-refresh-token")?.value, "refreshed-refresh");

console.log("session-cookies.test.ts: all assertions passed");
