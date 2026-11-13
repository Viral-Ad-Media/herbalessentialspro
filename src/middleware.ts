import { NextResponse, type NextRequest } from "next/server";

/**
 * - 301 old WordPress date-based URLs (/2022/08/16/slug/) to /slug
 * - 410 Gone for paths that only ever served malware or spam on the old site,
 *   so search engines drop them quickly
 */
const GONE = [/^\/hint(\/|$)/, /^\/humanityinternational(\/|$)/, /\.php$/i, /^\/wp-(admin|content|includes|login)/];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (GONE.some((r) => r.test(pathname))) {
    return new NextResponse("Gone", { status: 410 });
  }
  const dated = pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/);
  if (dated) return NextResponse.redirect(new URL(`/${dated[1]}`, req.url), 301);
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/|uploads/|api/|favicon.ico).*)"] };
