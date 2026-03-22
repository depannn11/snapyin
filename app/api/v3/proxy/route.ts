// app/api/v3/proxy/route.ts
// Proxy download untuk URL yang block CORS di browser (Douyin CDN, dll)
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return NextResponse.json({ error: "Parameter 'url' wajib diisi." }, { status: 400 });
  }

  // Hanya izinkan domain CDN yang diketahui aman
  const allowedDomains = [
    "365yg.com",
    "douyinpic.com",
    "douyinvod.com",
    "tiktokcdn.com",
    "tiktokcdn-us.com",
    "tikwm.com",
    "p26-sign.douyinpic.com",
    "v26-default.365yg.com",
  ];

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(fileUrl);
  } catch {
    return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
  }

  const isAllowed = allowedDomains.some((d) => parsedUrl.hostname.endsWith(d));
  if (!isAllowed) {
    return NextResponse.json({ error: "Domain tidak diizinkan." }, { status: 403 });
  }

  try {
    const upstream = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
        "Referer": "https://www.douyin.com/",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream error: ${upstream.status}` }, { status: 502 });
    }

    const contentType   = upstream.headers.get("content-type")   ?? "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");

    const headers = new Headers({
      "Content-Type":              contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control":             "no-store",
    });
    if (contentLength) headers.set("Content-Length", contentLength);

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil file dari upstream." }, { status: 500 });
  }
}
