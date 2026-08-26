import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const pages = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about/data", priority: 0.7, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.8, changeFrequency: "monthly" },
  {
    path: "/guides/how-leadforge-works",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/guides/open-business-data",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/guides/responsible-business-outreach",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/guides/exporting-business-data",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  { path: "/privacy", priority: 0.5, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
