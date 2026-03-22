"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, Loader2, Download, Video, Music,
  Play, Heart, MessageCircle, Share2, X, Pause,
} from "lucide-react";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface SearchVideo {
  id: string;
  title: string;
  cover: string;
  duration: number;
  author: { nickname: string; unique_id: string; avatar: string };
  stats: { play: number; likes: number; comment: number; share: number };
  download: {
    video_hd: string | null;
    video_sd: string | null;
    video_watermark: string | null;
    audio: string | null;
  };
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
function fmtDur(sec: number): string {
  return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Card
// ─────────────────────────────────────────────────────────────────────────────
function VideoCard({ video }: { video: SearchVideo }) {
  const { lang } = useLang();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [playing, setPlaying]         = useState(false);
  const [dlError, setDlError]         = useState("");
  const videoRef                      = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else         { videoRef.current.play();  setPlaying(true);  }
  };

  const downloadFile = async (url: string, filename: string, key: string) => {
    setDownloading(key); setDlError("");
    try {
      const blob    = await fetch(url).then((r) => r.blob());
      const blobUrl = URL.createObjectURL(blob);
      const a       = Object.assign(document.createElement("a"), { href: blobUrl, download: filename });
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(blobUrl); a.remove();
    } catch { setDlError(t(tr.err.dl_failed, lang)); }
    finally  { setDownloading(null); }
  };

  const playUrl = video.download.video_hd ?? video.download.video_sd ?? "";

  return (
    <Card className="border-border overflow-hidden group">
      <CardContent className="p-0">

        {/* Thumbnail / Player */}
        <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
          {/* Thumbnail shown when not playing */}
          {!playing && (
            <Image
              src={video.cover || "/placeholder.svg"}
              alt={video.title || "TikTok"}
              fill
              className="object-cover"
              unoptimized
            />
          )}

          {/* Video player */}
          {playUrl && (
            <video
              ref={videoRef}
              src={playUrl}
              className={`absolute inset-0 w-full h-full object-cover ${playing ? "opacity-100" : "opacity-0"}`}
              loop
              playsInline
              onEnded={() => setPlaying(false)}
            />
          )}

          {/* Duration badge */}
          {video.duration > 0 && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded font-mono">
              {fmtDur(video.duration)}
            </div>
          )}

          {/* Play/pause overlay */}
          {playUrl && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="rounded-full bg-white/90 p-3 shadow-lg">
                {playing
                  ? <Pause className="h-6 w-6 text-black" />
                  : <Play  className="h-6 w-6 text-black fill-black" />}
              </div>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-2">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Image
              src={video.author.avatar || "/placeholder.svg"}
              alt={video.author.nickname}
              width={28} height={28}
              className="rounded-full flex-shrink-0"
              unoptimized
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{video.author.nickname}</p>
              <p className="text-xs text-muted-foreground truncate">@{video.author.unique_id}</p>
            </div>
          </div>

          {/* Title */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {video.title}
          </p>

          {/* Stats */}
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Play       className="h-3 w-3" />{fmtNum(video.stats.play)}</span>
            <span className="flex items-center gap-1"><Heart      className="h-3 w-3" />{fmtNum(video.stats.likes)}</span>
            <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{fmtNum(video.stats.comment)}</span>
          </div>

          {/* Download buttons */}
          <div className="flex gap-1.5 pt-1">
            {video.download.video_hd && (
              <Button
                size="sm"
                className="flex-1 h-8 text-xs"
                disabled={downloading === "hd"}
                onClick={() => downloadFile(video.download.video_hd!, `tiktok_${video.id}_hd.mp4`, "hd")}
              >
                {downloading === "hd"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><Video className="mr-1 h-3 w-3" />HD</>}
              </Button>
            )}
            {video.download.video_sd && !video.download.video_hd && (
              <Button
                size="sm"
                className="flex-1 h-8 text-xs"
                disabled={downloading === "sd"}
                onClick={() => downloadFile(video.download.video_sd!, `tiktok_${video.id}.mp4`, "sd")}
              >
                {downloading === "sd"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><Video className="mr-1 h-3 w-3" />SD</>}
              </Button>
            )}
            {video.download.audio && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs bg-transparent"
                disabled={downloading === "audio"}
                onClick={() => downloadFile(video.download.audio!, `tiktok_${video.id}_audio.mp3`, "audio")}
              >
                {downloading === "audio"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><Music className="mr-1 h-3 w-3" />MP3</>}
              </Button>
            )}
          </div>
          {dlError && <p className="text-xs text-destructive">{dlError}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Search Component
// ─────────────────────────────────────────────────────────────────────────────
export function TikTokSearch() {
  const { lang }                      = useLang();
  const [query, setQuery]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [videos, setVideos]           = useState<SearchVideo[]>([]);
  const [cursor, setCursor]           = useState(0);
  const [hasMore, setHasMore]         = useState(false);
  const [lastQuery, setLastQuery]     = useState("");
  const [error, setError]             = useState("");

  const doSearch = async (kw: string, cur: number, append = false) => {
    if (!kw.trim()) return;
    append ? setLoadingMore(true) : setIsLoading(true);
    setError("");

    try {
      const res  = await fetch(`/api/v3/tiktok/search?q=${encodeURIComponent(kw)}&count=20&cursor=${cur}`);
      const json = await res.json();

      if (!json.success) {
        setError(json.error || t(tr.err.fetch_failed, lang));
        return;
      }

      setVideos((prev) => append ? [...prev, ...json.videos] : json.videos);
      setCursor(json.cursor ?? 0);
      setHasMore(json.has_more ?? false);
      setLastQuery(kw);
    } catch {
      setError(t(tr.err.fetch_failed, lang));
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVideos([]);
    setCursor(0);
    doSearch(query, 0);
  };

  const handleLoadMore = () => doSearch(lastQuery, cursor, true);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">

      {/* Search input card */}
      <Card className="border-2 border-border shadow-lg">
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError(""); }}
                placeholder={t(tr.search.placeholder, lang)}
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="h-12 px-8 text-base font-semibold">
              {isLoading
                ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t(tr.search.searching, lang)}</>
                : <><Search className="mr-2 h-5 w-5" />{t(tr.search.btn, lang)}</>}
            </Button>
          </form>
          {error && <p className="text-sm text-destructive font-medium mt-3">{error}</p>}
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[9/16] bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && videos.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground text-center">
            {videos.length} {t(tr.search.results, lang)} <strong className="text-foreground">"{lastQuery}"</strong>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {videos.map((v) => <VideoCard key={v.id ?? Math.random()} video={v} />)}
          </div>

          {hasMore && (
            <div className="text-center pt-2">
              <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore} className="px-8">
                {loadingMore
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t(tr.search.loading_more, lang)}</>
                  : t(tr.search.load_more, lang)}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!isLoading && lastQuery && videos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="mx-auto h-10 w-10 mb-3 opacity-30" />
          <p>{t(tr.search.no_results, lang)}</p>
        </div>
      )}
    </div>
  );
}
