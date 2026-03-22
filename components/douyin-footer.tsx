"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export function DouyinFooter() {
  const { lang } = useLang();

  const footerLinks = [
    { href: "/douyin",         label: t(tr.nav.home,    lang) },
    { href: "/douyin/faq",     label: t(tr.nav.faq,     lang) },
    { href: "/douyin/privacy", label: t(tr.nav.privacy, lang) },
    { href: "/douyin/guide",   label: t(tr.nav.guide,   lang) },
    { href: "/docs",           label: t(tr.nav.docs,    lang) },
    { href: "/",               label: "🎵 TikTok" },
  ];

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8">
          <Link href="/douyin" className="flex items-center gap-2 text-xl font-bold text-primary-foreground">
            <PlayCircle className="h-7 w-7" />
            <span>Snap<span className="opacity-70">Yin</span></span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="max-w-2xl text-center text-sm text-primary-foreground/60">
            <p className="mb-2">
              <strong className="text-primary-foreground">Disclaimer:</strong>{" "}
              {t(tr.footer.disclaimer_douyin, lang)}
            </p>
            <p>&copy; {new Date().getFullYear()} SnapYin by Snaptok. {t(tr.footer.rights, lang)}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
