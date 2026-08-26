import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  guides,
  footerColumns,
  getGuideNeighbours,
  isNavItemActive,
  primaryNavigation,
  resourceLinks,
} from "./navigation";

const publicRoutes = [
  "/",
  "/about",
  "/about/data",
  "/guides",
  "/guides/how-leadforge-works",
  "/guides/open-business-data",
  "/guides/responsible-business-outreach",
  "/guides/exporting-business-data",
  "/privacy",
  "/terms",
  "/contact",
];

const navHrefs = new Set(
  primaryNavigation.flatMap((item) => [
    item.href,
    ...(item.children ?? []).map((child) => child.href),
  ]),
);

describe("site navigation", () => {
  it("reaches every public route from the header", () => {
    for (const route of publicRoutes) expect(navHrefs).toContain(route);
  });

  it("reaches every public route from the footer", () => {
    const footerHrefs = new Set(
      footerColumns.flatMap((column) => column.links.map((link) => link.href)),
    );
    for (const route of publicRoutes) expect(footerHrefs).toContain(route);
  });

  it("marks the owning section active for nested routes", () => {
    const guidesItem = primaryNavigation.find((i) => i.label === "Guides")!;
    const resources = primaryNavigation.find((i) => i.label === "Resources")!;
    const home = primaryNavigation.find((i) => i.label === "Home")!;

    expect(isNavItemActive(guidesItem, "/guides")).toBe(true);
    expect(isNavItemActive(guidesItem, "/guides/open-business-data")).toBe(
      true,
    );
    expect(isNavItemActive(guidesItem, "/about")).toBe(false);
    for (const link of resourceLinks) {
      expect(isNavItemActive(resources, link.href)).toBe(true);
    }
    expect(isNavItemActive(home, "/")).toBe(true);
    expect(isNavItemActive(home, "/about")).toBe(false);
  });

  it("links guides in reading order", () => {
    expect(getGuideNeighbours(guides[0]!.slug).previous).toBeUndefined();
    expect(getGuideNeighbours(guides[0]!.slug).next?.slug).toBe(
      guides[1]!.slug,
    );
    const last = guides.at(-1)!;
    expect(getGuideNeighbours(last.slug).next).toBeUndefined();
    expect(getGuideNeighbours(last.slug).previous?.slug).toBe(
      guides.at(-2)!.slug,
    );
  });
});

describe("guide articles", () => {
  it("renders an anchor for every table-of-contents entry", () => {
    for (const guide of guides) {
      const page = readFileSync(
        `src/app/guides/${guide.slug}/page.tsx`,
        "utf8",
      );
      for (const section of guide.sections) {
        expect(
          page.includes(`id="${section.id}"`),
          `${guide.slug} is missing #${section.id}`,
        ).toBe(true);
      }
      // Every section on the page is listed in the contents, and only once.
      const rendered = page.match(/<section id="/g) ?? [];
      expect(rendered.length).toBe(guide.sections.length);
      expect(new Set(guide.sections.map((s) => s.id)).size).toBe(
        guide.sections.length,
      );
    }
  });

  it("loads the AdSense script on exactly the monetised articles", () => {
    for (const guide of guides) {
      const page = readFileSync(
        `src/app/guides/${guide.slug}/page.tsx`,
        "utf8",
      );
      expect(page).toContain("<AdSenseScript />");
    }
    for (const route of [
      "guides/page",
      "about/page",
      "privacy/page",
      "terms/page",
      "contact/page",
    ]) {
      expect(readFileSync(`src/app/${route}.tsx`, "utf8")).not.toContain(
        "AdSenseScript",
      );
    }
  });

  it("exempts exactly those articles from the Content-Security-Policy", () => {
    const config = readFileSync("next.config.ts", "utf8");
    const slugs = config
      .match(/const monetisedArticleSlugs = \[([\s\S]*?)\]/)![1]!
      .match(/"([^"]+)"/g)!
      .map((value) => value.replaceAll('"', ""));
    expect(slugs.sort()).toEqual(guides.map((g) => g.slug).sort());
  });
});
