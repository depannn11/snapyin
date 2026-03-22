import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, Globe, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentasi API - Snaptok",
  description: "Dokumentasi API publik Snaptok untuk download video TikTok dan Douyin via REST API.",
};

const BASE = "https://www.snaptok.my.id";

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">

          <div className="mb-12">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Dokumentasi API</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              REST API publik Snaptok untuk download video TikTok dan Douyin secara programatik. Gratis, tanpa API key.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-12">
            {[
              { icon: Zap, title: "REST API", desc: "Cukup HTTP GET biasa" },
              { icon: Globe, title: "2 Platform", desc: "TikTok & Douyin" },
              { icon: Lock, title: "Tanpa Auth", desc: "Tidak perlu API key" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-border">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Base URL */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Base URL</h2>
            <Card className="border-border">
              <CardContent className="p-6">
                <code className="text-base font-mono text-primary">{BASE}</code>
              </CardContent>
            </Card>
          </section>

          {/* Endpoint */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Endpoint</h2>
            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <Badge className="bg-blue-500 text-white hover:bg-blue-600">GET</Badge>
                  <code className="rounded bg-muted px-3 py-1.5 text-sm font-mono break-all">
                    /api/v3/download
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Satu endpoint untuk semua platform. Gunakan parameter <code className="font-mono text-xs bg-muted px-1 rounded">platform</code> untuk memilih TikTok atau Douyin.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Query Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Parameter</th>
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Tipe</th>
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Wajib</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-3 pr-4 font-mono text-xs">platform</td>
                        <td className="py-3 pr-4 text-muted-foreground">string</td>
                        <td className="py-3 pr-4"><Badge variant="destructive" className="text-xs">Ya</Badge></td>
                        <td className="py-3 text-muted-foreground">
                          <code className="font-mono text-xs bg-muted px-1 rounded">tiktok</code> atau <code className="font-mono text-xs bg-muted px-1 rounded">douyin</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-mono text-xs">url</td>
                        <td className="py-3 pr-4 text-muted-foreground">string</td>
                        <td className="py-3 pr-4"><Badge variant="destructive" className="text-xs">Ya</Badge></td>
                        <td className="py-3 text-muted-foreground">URL video (harus di-encode)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* TikTok */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">🎵 Contoh TikTok</h2>

            <Card className="mb-4 border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">URL Request</h3>
                <code className="block rounded bg-muted p-4 text-sm font-mono break-all leading-relaxed">
                  {BASE}/api/v3/download?platform=tiktok&url=https://vt.tiktok.com/ZSYxX1X1X/
                </code>
              </CardContent>
            </Card>

            <Card className="mb-4 border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">JavaScript</h3>
                <pre className="rounded bg-muted p-4 text-sm overflow-x-auto"><code>{`const videoUrl = "https://vt.tiktok.com/ZSYxX1X1X/";
const res = await fetch(
  \`https://www.snaptok.my.id/api/v3/download?platform=tiktok&url=\${encodeURIComponent(videoUrl)}\`
);
const json = await res.json();

if (json.success) {
  console.log(json.data.download.video_hd);   // Video HD tanpa WM
  console.log(json.data.download.video_sd);   // Video SD tanpa WM
  console.log(json.data.download.audio);      // Audio MP3
  console.log(json.data.download.images);     // Slideshow (array) atau null
}`}</code></pre>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Response Sukses</h3>
                <pre className="rounded bg-muted p-4 text-sm overflow-x-auto"><code>{`{
  "success": true,
  "platform": "tiktok",
  "data": {
    "id": "7234567890123456789",
    "title": "Judul video TikTok...",
    "cover": "https://p16-sign.tiktokcdn.com/...",
    "duration": 30,
    "author": {
      "nickname": "Username",
      "unique_id": "username123",
      "avatar": "https://..."
    },
    "stats": {
      "play_count": 120000,
      "digg_count": 5000,
      "comment_count": 300,
      "share_count": 150
    },
    "download": {
      "video_hd": "https://...",        // Video HD tanpa watermark
      "video_sd": "https://...",        // Video SD tanpa watermark
      "video_watermark": "https://...", // Video dengan watermark
      "audio": "https://...",           // Audio MP3
      "images": null                    // Array URL jika slideshow, null jika video
    }
  }
}`}</code></pre>
              </CardContent>
            </Card>
          </section>

          {/* Douyin */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">🎬 Contoh Douyin</h2>

            <Card className="mb-4 border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">URL Request</h3>
                <code className="block rounded bg-muted p-4 text-sm font-mono break-all leading-relaxed">
                  {BASE}/api/v3/download?platform=douyin&url=https://www.douyin.com/video/7357714141391506688
                </code>
              </CardContent>
            </Card>

            <Card className="mb-4 border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">JavaScript</h3>
                <pre className="rounded bg-muted p-4 text-sm overflow-x-auto"><code>{`const videoUrl = "https://www.douyin.com/video/7357714141391506688";
const res = await fetch(
  \`https://www.snaptok.my.id/api/v3/download?platform=douyin&url=\${encodeURIComponent(videoUrl)}\`
);
const json = await res.json();

if (json.success) {
  console.log(json.data.title);           // Judul video
  console.log(json.data.cover);           // URL thumbnail
  console.log(json.data.download.video);  // Video tanpa watermark
  console.log(json.data.download.audio);  // Audio (bisa null)
}`}</code></pre>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Response Sukses</h3>
                <pre className="rounded bg-muted p-4 text-sm overflow-x-auto"><code>{`{
  "success": true,
  "platform": "douyin",
  "data": {
    "title": "Judul video Douyin...",
    "cover": "https://p26-sign.douyinpic.com/...",
    "download": {
      "video": "https://v26-default.365yg.com/...", // Video tanpa watermark
      "audio": null                                  // Audio jika ada
    }
  }
}`}</code></pre>
              </CardContent>
            </Card>
          </section>


          {/* ── TikTok Search API ── */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold">🔍 TikTok Search API</h2>
              <Badge className="bg-green-500 text-white hover:bg-green-600">NEW</Badge>
            </div>
            <p className="text-muted-foreground mb-6">
              Cari video TikTok berdasarkan keyword. Returns daftar video beserta link download langsung.
            </p>

            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <Badge className="bg-blue-500 text-white hover:bg-blue-600">GET</Badge>
                  <code className="rounded bg-muted px-3 py-1.5 text-sm font-mono break-all">
                    /api/v3/tiktok/search
                  </code>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Parameter</th>
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Tipe</th>
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Wajib</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-3 pr-4 font-mono text-xs">q</td>
                        <td className="py-3 pr-4 text-muted-foreground">string</td>
                        <td className="py-3 pr-4"><Badge variant="destructive" className="text-xs">Ya</Badge></td>
                        <td className="py-3 text-muted-foreground">Keyword pencarian</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-mono text-xs">count</td>
                        <td className="py-3 pr-4 text-muted-foreground">number</td>
                        <td className="py-3 pr-4"><Badge variant="secondary" className="text-xs">Tidak</Badge></td>
                        <td className="py-3 text-muted-foreground">Jumlah video (default: 20, max: 50)</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-mono text-xs">cursor</td>
                        <td className="py-3 pr-4 text-muted-foreground">number</td>
                        <td className="py-3 pr-4"><Badge variant="secondary" className="text-xs">Tidak</Badge></td>
                        <td className="py-3 text-muted-foreground">Offset untuk pagination (default: 0)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">URL Request</h3>
                <code className="block rounded bg-muted p-4 text-sm font-mono break-all leading-relaxed">
                  {BASE}/api/v3/tiktok/search?q=funny+cats&count=20&cursor=0
                </code>
              </CardContent>
            </Card>

            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Contoh JavaScript</h3>
                <pre className="rounded bg-muted p-4 text-sm overflow-x-auto"><code>{`// Search videos
const res = await fetch(
  \`https://www.snaptok.my.id/api/v3/tiktok/search?q=\${encodeURIComponent("funny cats")}&count=20\`
);
const json = await res.json();

if (json.success) {
  json.videos.forEach(v => {
    console.log(v.title);
    console.log(v.download.video_hd);  // URL download HD
    console.log(v.download.audio);     // URL download MP3
  });

  // Pagination — load more
  if (json.has_more) {
    const next = await fetch(
      \`https://www.snaptok.my.id/api/v3/tiktok/search?q=funny+cats&cursor=\${json.cursor}\`
    );
  }
}`}</code></pre>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Response Sukses</h3>
                <pre className="rounded bg-muted p-4 text-sm overflow-x-auto"><code>{`{
  "success": true,
  "query": "funny cats",
  "count": 20,
  "cursor": 20,        // gunakan untuk load more
  "has_more": true,
  "videos": [
    {
      "id": "7234567890123456789",
      "title": "Judul video...",
      "cover": "https://...",
      "duration": 15,
      "author": {
        "nickname": "Username",
        "unique_id": "username123",
        "avatar": "https://..."
      },
      "stats": {
        "play": 120000,
        "likes": 5000,
        "comment": 300,
        "share": 150
      },
      "download": {
        "video_hd": "https://...",        // Video HD tanpa watermark
        "video_sd": "https://...",        // Video SD tanpa watermark
        "video_watermark": "https://...", // Video dengan watermark
        "audio": "https://..."            // Audio MP3
      }
    }
    // ... more videos
  ]
}`}</code></pre>
              </CardContent>
            </Card>
          </section>

          {/* Errors */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Error Response</h2>
            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">HTTP</th>
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">success</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">Penyebab</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { code: "400", desc: "Parameter platform tidak diisi atau tidak valid" },
                        { code: "400", desc: "Parameter url tidak diisi" },
                        { code: "400", desc: "URL bukan TikTok/Douyin, atau video privat/dihapus" },
                        { code: "500", desc: "Error server internal, coba beberapa saat lagi" },
                      ].map((row, i) => (
                        <tr key={i}>
                          <td className="py-3 pr-4 font-mono text-xs">{row.code}</td>
                          <td className="py-3 pr-4 font-mono text-xs text-red-500">false</td>
                          <td className="py-3 text-muted-foreground">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Contoh Error Response</h3>
                <pre className="rounded bg-muted p-4 text-sm overflow-x-auto"><code>{`{
  "success": false,
  "error": "Parameter 'platform' wajib diisi. Nilai yang valid: tiktok | douyin",
  "example": [
    "https://www.snaptok.my.id/api/v3/download?platform=tiktok&url=https://vt.tiktok.com/xxx",
    "https://www.snaptok.my.id/api/v3/download?platform=douyin&url=https://www.douyin.com/video/xxx"
  ]
}`}</code></pre>
              </CardContent>
            </Card>
          </section>

          {/* Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Tips Penggunaan</h2>
            <Card className="border-border">
              <CardContent className="p-6 space-y-4 text-sm text-muted-foreground">
                <p>✅ <strong className="text-foreground">Selalu encode URL</strong> — gunakan <code className="font-mono text-xs bg-muted px-1 rounded">encodeURIComponent(url)</code> agar karakter seperti <code className="font-mono text-xs bg-muted px-1 rounded">?</code>, <code className="font-mono text-xs bg-muted px-1 rounded">&</code> tidak merusak query string.</p>
                <p>✅ <strong className="text-foreground">Cek field images</strong> — untuk TikTok, jika <code className="font-mono text-xs bg-muted px-1 rounded">data.download.images</code> berisi array, konten adalah slideshow foto bukan video.</p>
                <p>✅ <strong className="text-foreground">Handle null</strong> — field <code className="font-mono text-xs bg-muted px-1 rounded">audio</code> dan <code className="font-mono text-xs bg-muted px-1 rounded">images</code> bisa bernilai <code className="font-mono text-xs bg-muted px-1 rounded">null</code>. Selalu cek sebelum digunakan.</p>
                <p>✅ <strong className="text-foreground">URL download tidak permanen</strong> — URL yang dikembalikan memiliki expiry time. Segera unduh setelah mendapat response.</p>
              </CardContent>
            </Card>
          </section>

          <div className="text-center p-8 bg-muted/50 rounded-xl border border-border">
            <h2 className="text-xl font-semibold mb-2">Ada pertanyaan tentang API?</h2>
            <p className="text-muted-foreground mb-4">Hubungi kami jika butuh bantuan integrasi</p>
            <a href="mailto:defandryannn@gmail.com" className="text-primary font-medium hover:underline">
              defandryannn@gmail.com
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
