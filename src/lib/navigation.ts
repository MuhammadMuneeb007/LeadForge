import { githubUrl } from "./site";

/**
 * Single source of truth for site navigation.
 *
 * The desktop menu, the mobile menu, the footer, the guide table of contents
 * and the previous/next guide links are all derived from the values below, so a
 * route name or a section anchor is written down exactly once.
 */

export type NavSection = { id: string; label: string };

export type Guide = {
  slug: string;
  href: string;
  /** Full article title, used on the index and in previous/next links. */
  title: string;
  /** Shorter form for menus, where horizontal space is tight. */
  navTitle: string;
  /** Category chip shown on the hero and the index card. */
  badge: string;
  summary: string;
  /** One line on the index card describing who the guide is for. */
  audience: string;
  /** Article sections, in document order. Each id is an anchor on the page. */
  sections: NavSection[];
};

/** Reading order. Previous/next navigation follows this sequence. */
export const guides: Guide[] = [
  {
    slug: "how-leadforge-works",
    href: "/guides/how-leadforge-works",
    title: "How LeadForge works",
    navTitle: "How LeadForge works",
    badge: "START HERE",
    summary:
      "The complete workflow, from choosing a country and radius to exporting a verified shortlist — including what happens behind each step and why a search sometimes returns nothing.",
    audience: "Start here if you have never run a search.",
    sections: [
      {
        id: "choose-the-country-and-place",
        label: "Choose the country and place",
      },
      { id: "choose-the-business-types", label: "Choose the business types" },
      { id: "set-the-radius", label: "Set the radius and result cap" },
      {
        id: "what-happens-when-you-search",
        label: "What happens when you search",
      },
      { id: "reading-the-results", label: "Reading the results" },
      { id: "list-map-or-both", label: "List, map, or both" },
      { id: "saving-a-shortlist", label: "Saving a shortlist" },
      { id: "contact-discovery", label: "Optional contact discovery" },
      {
        id: "verify-before-you-use-anything",
        label: "Verify before you use anything",
      },
      { id: "export-what-you-selected", label: "Export what you selected" },
      { id: "limitations", label: "What the tool cannot tell you" },
    ],
  },
  {
    slug: "open-business-data",
    href: "/guides/open-business-data",
    title: "Working with open business data",
    navTitle: "Open business data",
    badge: "DATA",
    summary:
      "What open geographic data is, how OpenStreetMap records businesses, why phone numbers and opening hours are so often missing, and why a map listing is not a business registry.",
    audience: "Read this to judge how much a result set is worth.",
    sections: [
      { id: "what-open-data-means", label: "What open data means here" },
      {
        id: "how-openstreetmap-records-a-business",
        label: "How OpenStreetMap records a business",
      },
      { id: "listing-fields", label: "The fields a listing may carry" },
      { id: "why-coverage-varies", label: "Why coverage varies so much" },
      {
        id: "missing-contact-details",
        label: "Why the phone number is missing",
      },
      {
        id: "why-verification-matters",
        label: "Why every record needs verification",
      },
      { id: "geonames", label: "What GeoNames contributes" },
      { id: "openfreemap", label: "What OpenFreeMap contributes" },
      { id: "not-a-registry", label: "A map listing is not a registry" },
      { id: "attribution-and-licensing", label: "Attribution and licensing" },
      {
        id: "using-open-data-responsibly",
        label: "Using open datasets responsibly",
      },
    ],
  },
  {
    slug: "responsible-business-outreach",
    href: "/guides/responsible-business-outreach",
    title: "Responsible business outreach",
    navTitle: "Responsible outreach",
    badge: "OUTREACH",
    summary:
      "Verifying details before you use them, telling business contacts from personal ones, honouring opt-outs, keeping lists current, and the questions to ask before any campaign.",
    audience: "Read this before you contact anyone.",
    sections: [
      {
        id: "what-the-data-does-not-say",
        label: "Start from what the data does not say",
      },
      {
        id: "verify-before-you-use-anything",
        label: "Verify before you use anything",
      },
      {
        id: "establish-relevance",
        label: "Establish relevance before contact",
      },
      { id: "no-bulk-messaging", label: "Do not send bulk messages" },
      {
        id: "business-vs-personal-contacts",
        label: "Business and personal contacts",
      },
      { id: "honour-opt-outs", label: "Honour opt-outs permanently" },
      { id: "know-the-rules", label: "Know which rules apply to you" },
      { id: "do-not-mislead", label: "Do not mislead" },
      { id: "keep-lists-current", label: "Keep lists current and small" },
      { id: "respect-access-controls", label: "Respect access controls" },
      { id: "pre-send-checklist", label: "A short pre-send checklist" },
    ],
  },
  {
    slug: "exporting-business-data",
    href: "/guides/exporting-business-data",
    title: "Exporting business data",
    navTitle: "Exporting business data",
    badge: "EXPORT",
    summary:
      "Every export LeadForge produces, what each CSV column contains, how to clean and de-duplicate a list, and how to move it into a spreadsheet or CRM without losing its provenance.",
    audience: "Read this when your shortlist is ready to leave the browser.",
    sections: [
      { id: "decide-what-to-export", label: "Decide what to export" },
      { id: "what-the-csv-contains", label: "What the CSV contains" },
      { id: "csv-details", label: "Two CSV details that surprise people" },
      { id: "when-to-use-geojson", label: "When to use GeoJSON instead" },
      { id: "importing-a-list", label: "Importing a list back in" },
      { id: "cleaning-a-list", label: "Cleaning a list" },
      { id: "verify-before-crm-import", label: "Verify before a CRM import" },
      { id: "look-after-the-file", label: "Look after the file" },
      { id: "re-run-rather-than-reuse", label: "Re-run rather than reuse" },
    ],
  },
];

/**
 * The guide article routes that load AdSense. next.config.ts keeps a matching
 * list to decide which routes are exempt from the advertising-blocking CSP;
 * a unit test asserts the two stay in step.
 */
export const monetisedGuidePaths = guides.map((guide) => guide.href);

export const getGuide = (slug: string) =>
  guides.find((guide) => guide.slug === slug);

/** Previous and next in reading order, for end-of-article navigation. */
export function getGuideNeighbours(slug: string) {
  const index = guides.findIndex((guide) => guide.slug === slug);
  return {
    previous: index > 0 ? guides[index - 1] : undefined,
    next:
      index >= 0 && index < guides.length - 1 ? guides[index + 1] : undefined,
  };
}

/** Up to two other guides, in reading order, for the related section. */
export const getRelatedGuides = (slug: string, count = 2) =>
  guides.filter((guide) => guide.slug !== slug).slice(0, count);

export type NavLink = { href: string; label: string; external?: boolean };

export const resourceLinks: NavLink[] = [
  { href: "/about/data", label: "Data & attribution" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export const guideMenuLinks: NavLink[] = [
  { href: "/guides", label: "All guides" },
  ...guides.map((guide) => ({ href: guide.href, label: guide.navTitle })),
];

export type NavItem = {
  href: string;
  label: string;
  /** Routes that should light up this item, in addition to href itself. */
  match?: string[];
  children?: NavLink[];
};

export const primaryNavigation: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/guides",
    label: "Guides",
    match: ["/guides"],
    children: guideMenuLinks,
  },
  { href: "/about", label: "About" },
  {
    href: "/about/data",
    label: "Resources",
    match: ["/about/data", "/privacy", "/terms", "/contact"],
    children: resourceLinks,
  },
];

export const issuesUrl = `${githubUrl}/issues`;

/** Footer columns, derived from the same definitions as the header. */
export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Home" },
      { href: "/#workspace", label: "Find businesses" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Guides",
    links: guideMenuLinks,
  },
  {
    title: "Resources",
    links: [
      ...resourceLinks,
      { href: githubUrl, label: "Source code", external: true },
      { href: issuesUrl, label: "Report an issue", external: true },
    ],
  },
];

/** True when `pathname` should mark `item` as the current section. */
export function isNavItemActive(item: NavItem, pathname: string) {
  if (pathname === item.href) return true;
  return (item.match ?? []).some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  );
}
