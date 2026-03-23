// app/api/v3/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { validateApiKey, incrementRequests, extractApiKey } from "@/lib/apikey";

const DOUYIN_ENDPOINT = "https://api.seekin.ai/ikool/media/download";
const DOUYIN_SECRET   = "3HT8hjE79L";

function sortAndStringify(obj: Record<string, string>): string {
  if (!obj || typeof obj !== "object") return "";
  return Object.keys(obj).sort().map((k) => `${k}=${obj[k]}`).join("&");
}
function buildDouyinHeaders(body: Record<string, string>): Record<string, string> {
  const lang = "en", timestamp = Date.now().toString();
  const raw  = `${lang}${timestamp}${DOUYIN_SECRET}${sortAndStringify(body)}`;
  const sign = createHash("sha256").update(raw).digest("hex");
  return {
    "accept": "*/*", "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json", "lang": lang,
    "origin": "https://www.seekin.ai", "referer": "https://www.seekin.ai/",
    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
    "sign": sign, "timestamp": timestamp,
  };
}
function errRes(message: string, status = 400, extra?: object) {
  return NextResponse.json({ success: false, error: message, ...extra }, { status });
}
function proxy(u: string | null): string | null {
  return u ? `/api/v3/proxy?url=${encodeURIComponent(u)}` : null;
}

export async function GET(req: NextRequest) {
  // ── API Key validation ────────────────────────────────────────────────────
  const apikey = extractApiKey(req);
  const auth   = await validateApiKey(apikey);
  if (!auth.valid) return errRes(auth.error ?? "API key tidak valid.", 401, { docs: "https://www.snaptok.my.id/docs" });

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform")?.toLowerCase();
  const videoUrl = searchParams.get("url");

  if (!platform || !["tiktok", "douyin"].includes(platform)) {
    return errRes("Parameter 'platform' wajib diisi. Nilai yang valid: tiktok | douyin", 400, {
      example: ["https://www.snaptok.my.id/api/v3/download?platform=tiktok&url=...&apikey=snp-xxx",
                "https://www.snaptok.my.id/api/v3/download?platform=douyin&url=...&apikey=snp-xxx"],
    });
  }
  if (!videoUrl) return errRes("Parameter 'url' wajib diisi.");

  // ── TikTok ────────────────────────────────────────────────────────────────
  if (platform === "tiktok") {
    const valid = videoUrl.includes("tiktok.com") || videoUrl.includes("vt.tiktok") || videoUrl.includes("vm.tiktok");
    if (!valid) return errRes("URL bukan URL TikTok yang valid.");
    try {
      const res  = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`);
      const json = await res.json();
      if (json.code !== 0 || !json.data) return errRes(json.msg || "Gagal mengambil data video TikTok.");
      const d = json.data;
      await incrementRequests(auth.username!);
      return NextResponse.json({
        success: true, platform: "tiktok",
        data: {
          id: d.id ?? null, title: d.title ?? "", cover: d.cover ?? "", duration: d.duration ?? 0,
          author: { nickname: d.author?.nickname ?? "", unique_id: d.author?.unique_id ?? "", avatar: d.author?.avatar ?? "" },
          stats: { play: d.play_count ?? 0, likes: d.digg_count ?? 0, comment: d.comment_count ?? 0, share: d.share_count ?? 0 },
          music: d.music_info ? { title: d.music_info.title ?? "", author: d.music_info.author ?? "" } : null,
          download: { video_hd: d.hdplay ?? null, video_sd: d.play ?? null, video_watermark: d.wmplay ?? null, audio: d.music ?? null, images: d.images ?? null },
        },
      });
    } catch { return errRes("Terjadi kesalahan server saat mengambil data TikTok.", 500); }
  }

  // ── Douyin ────────────────────────────────────────────────────────────────
  if (platform === "douyin") {
    const valid = videoUrl.includes("douyin.com") || videoUrl.includes("v.douyin");
    if (!valid) return errRes("URL bukan URL Douyin yang valid.");
    try {
      const body = { url: videoUrl };
      const res  = await fetch(DOUYIN_ENDPOINT, { method: "POST", headers: buildDouyinHeaders(body), body: JSON.stringify(body) });
      const json = await res.json();
      if (!json.data) return errRes(json.msg || "Gagal mengambil data video Douyin.");
      const d = json.data;
      await incrementRequests(auth.username!);
      return NextResponse.json({
        success: true, platform: "douyin",
        data: { title: d.title ?? "", cover: d.imageUrl ?? "",
          download: { video: proxy(d.medias?.[0]?.url ?? null), audio: proxy(d.music ?? null) } },
      });
    } catch { return errRes("Terjadi kesalahan server saat mengambil data Douyin.", 500); }
  }
}
