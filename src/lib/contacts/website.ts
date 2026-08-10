import * as cheerio from "cheerio";
import pLimit from "p-limit";
import type { BusinessLead } from "@/types/lead";
import type {
  ContactEnrichmentProvider,
  ContactEnrichmentResult,
} from "./types";
import { assertPublicUrl } from "./ssrf";
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const socialHosts = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "tiktok.com",
];
async function fetchHtml(start: string) {
  let url = await assertPublicUrl(start);
  for (let redirects = 0; redirects < 4; redirects++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": "LeadForge contact discovery/1.0" },
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) throw new Error("Invalid redirect.");
        url = await assertPublicUrl(new URL(location, url).toString());
        continue;
      }
      if (
        !response.ok ||
        !(response.headers.get("content-type") ?? "").includes("text/html")
      )
        throw new Error("Website did not return HTML.");
      const declared = Number(response.headers.get("content-length") ?? 0);
      if (declared > 1_000_000) throw new Error("Website page is too large.");
      const text = await response.text();
      if (new TextEncoder().encode(text).byteLength > 1_000_000)
        throw new Error("Website page is too large.");
      return { text, url };
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("Too many redirects.");
}
async function enrichOne(lead: BusinessLead): Promise<ContactEnrichmentResult> {
  if (!lead.website)
    return {
      id: lead.id,
      emails: lead.emails,
      socials: lead.socials,
      warning: "No website is listed.",
    };
  try {
    const first = await fetchHtml(lead.website);
    const pages = [first];
    const $ = cheerio.load(first.text);
    const contact = $("a[href]")
      .toArray()
      .map((a) => $(a).attr("href") ?? "")
      .find((href) => /contact|about/i.test(href));
    if (contact) {
      const next = new URL(contact, first.url);
      if (next.hostname === first.url.hostname)
        pages.push(await fetchHtml(next.toString()));
    }
    const emails = new Set(lead.emails);
    const socials = new Set(lead.socials);
    for (const page of pages) {
      const doc = cheerio.load(page.text);
      (page.text.match(emailPattern) ?? []).forEach((email) => {
        emails.add(email.toLowerCase());
      });
      doc("a[href^='mailto:']").each((_, a) => {
        emails.add(
          (doc(a).attr("href") ?? "").slice(7).split("?")[0]!.toLowerCase(),
        );
      });
      doc("a[href]").each((_, a) => {
        const href = doc(a).attr("href");
        if (!href) return;
        try {
          const url = new URL(href, page.url);
          if (
            socialHosts.some(
              (host) =>
                url.hostname === host || url.hostname.endsWith(`.${host}`),
            )
          )
            socials.add(url.toString());
        } catch {}
      });
    }
    return {
      id: lead.id,
      emails: [...emails].slice(0, 20),
      socials: [...socials].slice(0, 20),
    };
  } catch {
    return {
      id: lead.id,
      emails: lead.emails,
      socials: lead.socials,
      warning: "The website could not be safely inspected.",
    };
  }
}
export const websiteContactProvider: ContactEnrichmentProvider = {
  async enrich(leads) {
    const limit = pLimit(3);
    return Promise.all(leads.map((lead) => limit(() => enrichOne(lead))));
  },
};
