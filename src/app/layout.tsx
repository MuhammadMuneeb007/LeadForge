import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = {
  title: "LeadForge — Local business discovery",
  description:
    "A fast public-beta tool for discovering local businesses by country, city, and category.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9384419506874151"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <body className={geist.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
