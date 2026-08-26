import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LeadForge — Open local business discovery",
    template: "%s | LeadForge",
  },
  description: siteDescription,
  applicationName: siteName,
  category: "business",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName,
    url: siteUrl,
    title: "LeadForge — Open local business discovery",
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: "LeadForge — Open local business discovery",
    description: siteDescription,
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
