import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LangProvider } from "@/lib/lang-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snaptok - Download TikTok Without Watermark",
  description: "Download TikTok videos without watermark FREE. Download TikTok HD, MP3, images - Fast & Safe, no registration.",
  keywords: ["tiktok downloader", "download tiktok", "no watermark", "tiktok video", "mp3 tiktok"],
  openGraph: {
    title: "Snaptok - Download TikTok Without Watermark",
    description: "Download TikTok without watermark free",
    url: "https://snaptok.my.id",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snaptok - Download TikTok",
    description: "Download TikTok videos without watermark free",
  },
  generator: "snaptok.my.id",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LangProvider>
          {children}
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
