import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const target = new URL(`/p/${slug}`, url.origin);
  url.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  return NextResponse.redirect(target);
}
