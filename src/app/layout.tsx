import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "دستیار اینستاگرام — پاسخگوی خودکار دایرکت",
  description: "سیستم پاسخگوی خودکار برای ادمین‌های اینستاگرام. قوانین کلمه کلیدی، پاسخ پیش‌فرض و شبیه‌ساز پیام.",
  keywords: ["اینستاگرام", "پاسخ خودکار", "ادمین اینستاگرام", "auto responder", "Instagram"],
  authors: [{ name: "mmyadegar" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased bg-background text-foreground font-vazirmatn`}
        style={{ fontFamily: 'var(--font-vazirmatn), var(--font-geist-sans), sans-serif' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
