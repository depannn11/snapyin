// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET  = new TextEncoder().encode("snaptok-jwt-secret-2026-defandryan");
const COOKIE_NAME = "snaptok_session";

const VALID_LANGS = ["en", "id", "ru", "zh", "ar"];

async function getSession(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch { return null; }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. Protect /docs → redirect to /auth/login ─────────────────────────────
  if (pathname === "/docs" || pathname.startsWith("/docs/")) {
    const session = await getSession(req);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── 2. Protect /auth/profile → redirect to /auth/login ─────────────────────
  if (pathname.startsWith("/auth/profile")) {
    const session = await getSession(req);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // ── 3. Redirect logged-in users away from login/register ───────────────────
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    const session = await getSession(req);
    if (session) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/profile";
      return NextResponse.redirect(url);
    }
  }

  // ── 4. Validate [lang] prefix ──────────────────────────────────────────────
  // /en/tiktok, /id/douyin, /ru/tiktok-search etc
  const langMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (langMatch) {
    const lang = langMatch[1];
    if (!VALID_LANGS.includes(lang)) {
      // Unknown lang prefix → 404
      return NextResponse.next();
    }
    // Valid lang — set cookie and continue
    const res = NextResponse.next();
    res.cookies.set("lang", lang, { path: "/", maxAge: 31536000 });
    return res;
  }

  // ── 5. Protect /api/v3/* with API key ─────────────────────────────────────
  if (pathname.startsWith("/api/v3/")) {
    // proxy tidak perlu apikey (internal)
    if (pathname.startsWith("/api/v3/proxy")) return NextResponse.next();

    const url    = req.nextUrl;
    const apikey = url.searchParams.get("apikey") ?? req.headers.get("x-api-key") ?? "";

    if (!apikey || !apikey.startsWith("snp-")) {
      return NextResponse.json(
        {
          success: false,
          error: "API key wajib. Tambahkan ?apikey=snp-xxxxx atau header X-API-Key.",
          docs: "https://www.snaptok.my.id/docs",
        },
        { status: 401 }
      );
    }
    // Key format valid — actual lookup dilakukan di route handler
    // (middleware tidak bisa import lib/ yang pakai fetch karena cold start)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
