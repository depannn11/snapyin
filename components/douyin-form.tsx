"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Link as LinkIcon, Clipboard, Loader2, Video, Music, X, CheckCircle2, Check } from "lucide-react";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

interface DouyinData {
  title: string;
  cover: string;
  download: { video: string | null; audio: string | null };
}

function extractDouyinUrl(text: string): string {
  const m = text.match(/https?:\/\/(?:www\.)?(?:douyin\.com|v\.douyin\.com)[^\s]*/i);
  return m ? m[0] : text.trim();
}

export function DouyinForm() {
  const { lang } = useLang();
  const [url, setUrl]                 = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [videoData, setVideoData]     = useState<DouyinData | null>(null);
  const [error, setError]             = useState("");
  const [pasted, setPasted]           = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(extractDouyinUrl(text));
      setPasted(true); setError("");
      setTimeout(() => setPasted(false), 2000);
    } catch { setError(t(tr.err.clipboard, lang)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = extractDouyinUrl(url);
    if (!clean) { setError(t(tr.err.enter_url_dy, lang)); return; }
    if (!clean.includes("douyin.com") && !clean.includes("v.douyin")) {
      setError(t(tr.err.invalid_url_dy, lang)); return;
    }
    setIsLoading(true); setError(""); setVideoData(null);
    try {
      const res  = await fetch(`/api/v3/download?platform=douyin&url=${encodeURIComponent(clean)}`);
      const json = await res.json();
      if (!json.success) setError(json.error || t(tr.err.fetch_failed, lang));
      else setVideoData(json.data as DouyinData);
    } catch { setError(t(tr.err.fetch_failed, lang)); }
    finally { setIsLoading(false); }
  };

  const downloadFile = async (dlUrl: string, filename: string, key: string) => {
    setDownloading(key);
    try {
      const blob = await fetch(dlUrl).then((r) => r.blob());
      const blobUrl = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: blobUrl, download: filename });
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(blobUrl); a.remove();
    } catch { setError(t(tr.err.dl_failed, lang)); }
    finally { setDownloading(null); }
  };

  const clearResult = () => { setVideoData(null); setUrl(""); setError(""); };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-2 border-border shadow-lg">
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button type="button" variant="secondary" onClick={handlePaste} className="w-full md:w-auto">
              {pasted ? <><Check className="mr-2 h-4 w-4 text-green-500" />{t(tr.ui.pasted, lang)}</>
                      : <><Clipboard className="mr-2 h-4 w-4" />{t(tr.ui.paste, lang)}</>}
            </Button>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input type="text" value={url} onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  placeholder={t(tr.douyin_home.placeholder, lang)} className="h-12 pl-10 text-base" />
              </div>
              <Button type="submit" disabled={isLoading} className="h-12 px-8 text-base font-semibold">
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t(tr.ui.processing, lang)}</>
                           : <><Download className="mr-2 h-5 w-5" />{t(tr.ui.download_now, lang)}</>}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setUrl("https://www.douyin.com/video/7357714141391506688")} className="rounded-full bg-transparent">
          <LinkIcon className="mr-2 h-4 w-4" />{t(tr.ui.example_link, lang)}
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-full bg-transparent">
          <a href="/douyin/guide"><CheckCircle2 className="mr-2 h-4 w-4" />{t(tr.ui.how_it_works, lang)}</a>
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-full bg-transparent">
          <a href="/douyin/faq"><CheckCircle2 className="mr-2 h-4 w-4" />{t(tr.ui.help, lang)}</a>
        </Button>
      </div>

      {isLoading && (
        <Card className="border-2 border-border">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">{t(tr.ui.processing_video, lang)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {videoData && !isLoading && (
        <Card className="border-2 border-border shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-bold">{t(tr.ui.result_title, lang)}</h3>
              <Button variant="ghost" size="icon" onClick={clearResult}><X className="h-5 w-5" /></Button>
            </div>
            <div className="flex flex-col md:flex-row">
              {videoData.cover && (
                <div className="relative w-full md:w-56 h-72 md:h-auto flex-shrink-0">
                  <Image src={videoData.cover} alt={videoData.title || "Douyin"} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="flex-1 p-4">
                <p className="text-sm text-foreground line-clamp-3 mb-4">{videoData.title || "Video Douyin"}</p>
                <div className="space-y-2">
                  {videoData.download.video && (
                    <Button onClick={() => downloadFile(videoData.download.video!, "douyin_video.mp4", "video")} disabled={downloading === "video"} className="w-full">
                      {downloading === "video" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                      {t(tr.dl.video_no_wm, lang)}
                    </Button>
                  )}
                  {videoData.download.audio && (
                    <Button variant="outline" onClick={() => downloadFile(videoData.download.audio!, "douyin_audio.mp3", "audio")} disabled={downloading === "audio"} className="w-full bg-transparent">
                      {downloading === "audio" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Music className="mr-2 h-4 w-4" />}
                      {t(tr.dl.audio, lang)}
                    </Button>
                  )}
                  {!videoData.download.video && !videoData.download.audio && (
                    <p className="text-sm text-muted-foreground text-center py-2">{t(tr.ui.no_media, lang)}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
