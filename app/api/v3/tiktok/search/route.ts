// app/api/v3/tiktok/search/route.ts
// GET /api/v3/tiktok/search?q=keyword&count=20&cursor=0
import { NextRequest, NextResponse } from "next/server";

function errRes(message: string, status = 400, extra?: object) {
  return NextResponse.json({ success: false, error: message, ...extra }, { status });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q      = searchParams.get("q")?.trim();
  const count  = Math.min(Number(searchParams.get("count")  ?? 20), 50);
  const cursor = Number(searchParams.get("cursor") ?? 0);

  if (!q) {
    return errRes("Parameter 'q' wajib diisi.", 400, {
      example: "https://www.snaptok.my.id/api/v3/tiktok/search?q=funny+cats&count=20&cursor=0",
    });
  }

  try {
    const body = new URLSearchParams({
      keywords: q,
      count:    String(count),
      cursor:   String(cursor),
      HD:       "1",
    });

    const res = await fetch("https://tikwm.com/api/feed/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie":       "current_language=en",
        "User-Agent":   "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
      body: body.toString(),
    });

    const json = await res.json();
    const videos = json?.data?.videos;

    if (!videos || videos.length === 0) {
      return errRes("Tidak ada video ditemukan untuk keyword tersebut.");
    }

    return NextResponse.json({
      success: true,
      query:   q,
      count:   videos.length,
      cursor:  json?.data?.cursor ?? 0,
      has_more: json?.data?.has_more ?? false,
      videos: videos.map((v: Record<string, unknown>) => ({
        id:       v.video_id ?? v.id ?? null,
        title:    v.title    ?? "",
        cover:    v.cover    ?? "",
        duration: v.duration ?? 0,
        author: {
          nickname:  (v.author as Record<string,string>)?.nickname  ?? "",
          unique_id: (v.author as Record<string,string>)?.unique_id ?? "",
          avatar:    (v.author as Record<string,string>)?.avatar    ?? "",
        },
        stats: {
          play:    (v.play_count    as number) ?? 0,
          likes:   (v.digg_count    as number) ?? 0,
          comment: (v.comment_count as number) ?? 0,
          share:   (v.share_count   as number) ?? 0,
        },
        download: {
          video_hd:        (v.hdplay as string) ?? (v.play as string) ?? null,
          video_sd:        (v.play   as string) ?? null,
          video_watermark: (v.wmplay as string) ?? null,
          audio:           (v.music  as string) ?? null,
        },
      })),
    });
  } catch (e) {
    console.error("Search error:", e);
    return errRes("Terjadi kesalahan server saat mencari video.", 500);
  }
}
