import assert from "node:assert/strict";
import { NextResponse } from "next/server";
import { withSupabaseAuthCookies } from "./session-cookies";

const sessionResponse = NextResponse.next();
sessionResponse.cookies.set("sb-test-auth", "rotated", { path: "/", maxAge: 300 });

const normal = NextResponse.next();
withSupabaseAuthCookies(sessionResponse, normal);
assert.equal(normal.cookies.get("sb-test-auth")?.value, "rotated");

const redirect = NextResponse.redirect("https://app.aipify.ai/login");
withSupabaseAuthCookies(sessionResponse, redirect);
assert.equal(redirect.cookies.get("sb-test-auth")?.value, "rotated");

console.log("update-session cookie propagation.test.ts: all assertions passed");
