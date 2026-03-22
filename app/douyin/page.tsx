"use client";
import { DouyinHeader } from "@/components/douyin-header";
import { DouyinFooter } from "@/components/douyin-footer";
import { DouyinForm } from "@/components/douyin-form";
import { DouyinFeatures } from "@/components/douyin-features";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export default function DouyinPage() {
  const { lang } = useLang();
  const stats = [
    { value: "100%", label: t(tr.stats.free,    lang) },
    { value: "No",   label: t(tr.stats.no_wm,   lang) },
    { value: "HD",   label: t(tr.stats.quality, lang) },
    { value: "Fast", label: t(tr.stats.fast,    lang) },
  ];
  return (
    <div className="flex min-h-screen flex-col">
      <DouyinHeader />
      <main className="flex-1">
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              {t(tr.douyin_home.hero_title, lang).replace(t(tr.douyin_home.hero_grad, lang), "")}{" "}
              <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                {t(tr.douyin_home.hero_grad, lang)}
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
              <strong className="text-foreground">SnapYin</strong> — {t(tr.douyin_home.hero_sub, lang)}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto mb-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="pb-16 px-4">
          <div className="container mx-auto"><DouyinForm /></div>
        </section>
        <DouyinFeatures />
      </main>
      <DouyinFooter />
    </div>
  );
}
