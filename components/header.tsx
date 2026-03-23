"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PlayCircle, Menu, Home, HelpCircle, Shield, BookOpen, FileText, User } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export function Header() {
  const [isOpen,  setIsOpen]  = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((j) => setLoggedIn(!!j.success)).catch(() => {});
  }, []);

  const navLinks = [
    { href: "/",        label: t(tr.nav.home,    lang), icon: Home },
    { href: "/faq",     label: t(tr.nav.faq,     lang), icon: HelpCircle },
    { href: "/privacy", label: t(tr.nav.privacy, lang), icon: Shield },
    { href: "/guide",   label: t(tr.nav.guide,   lang), icon: BookOpen },
    { href: "/docs",    label: t(tr.nav.docs,    lang), icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground transition-colors hover:text-foreground/80">
          <PlayCircle className="h-7 w-7 text-primary" />
          <span>Snap<span className="text-muted-foreground">-Tok</span></span>
        </Link>

        {/* Platform switcher */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-border bg-muted p-1 text-sm">
          <span className="rounded-full px-4 py-1.5 font-medium bg-background text-foreground shadow-sm">🎵 TikTok</span>
          <Link href="/douyin" className="rounded-full px-4 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground">🎬 Douyin</Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <div className="ml-1 pl-1 border-l border-border flex items-center gap-1">
            <LanguageSwitcher />
            {loggedIn && (
              <Link href="/auth/profile">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          {loggedIn && (
            <Link href="/auth/profile"><Button variant="ghost" size="icon" className="h-8 w-8"><User className="h-4 w-4" /></Button></Link>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /><span className="sr-only">Menu</span></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={() => setIsOpen(false)}>
                  <PlayCircle className="h-7 w-7 text-primary" />
                  <span>Snap<span className="text-muted-foreground">-Tok</span></span>
                </Link>
                <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-1 text-sm w-fit">
                  <span className="rounded-full px-4 py-1.5 font-medium bg-background text-foreground shadow-sm">🎵 TikTok</span>
                  <Link href="/douyin" className="rounded-full px-4 py-1.5 font-medium text-muted-foreground" onClick={() => setIsOpen(false)}>🎬 Douyin</Link>
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <Icon className="h-5 w-5" />{link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
