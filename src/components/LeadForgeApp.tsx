"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Header, type View } from "@/components/layout/Header";
import { SearchForm } from "@/components/search/SearchForm";
import { LeadList } from "@/components/leads/LeadList";
import { CustomBusinessForm } from "@/components/leads/CustomBusinessForm";
import { LeadMapLoader } from "@/components/map/LeadMapLoader";
import { DataAttribution } from "@/components/DataAttribution";
import { downloadCsv, downloadGeoJson } from "@/lib/csv/export";
import { importLeadsCsv } from "@/lib/csv/import";
import {
  clearLocalData,
  readHistory,
  readSelected,
  saveHistory,
  saveSelected,
  type HistoryEntry,
} from "@/lib/storage/local-history";
import type { BusinessLead, SearchInput, SearchResponse } from "@/types/lead";

const contactFilterOptions = [
  ["phone", "Phone"],
  ["email", "Email"],
  ["website", "Website"],
  ["social", "Social"],
  ["hours", "Hours"],
] as const;

export function LeadForgeApp() {
  const [view, setView] = useState<View>("discover");
  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [saved, setSaved] = useState<BusinessLead[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selected, setSelected] = useState(new Set<string>());
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState<"list" | "map" | "split">("split");
  const [activeId, setActiveId] = useState<string>();
  const [enriching, setEnriching] = useState(new Set<string>());
  const [text, setText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [contactFilters, setContactFilters] = useState(new Set<string>());
  const [sortBy, setSortBy] = useState<"distance" | "name" | "completeness">(
    "distance",
  );
  const [addingBusiness, setAddingBusiness] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    void Promise.all([readSelected(), readHistory()]).then(([a, b]) => {
      setSaved(a);
      setHistory(b);
    });
  }, []);
  const source = view === "saved" ? saved : leads;
  const categories = useMemo(
    () => [...new Set(source.map((lead) => lead.category))].sort(),
    [source],
  );
  const cities = useMemo(
    () => [...new Set(source.map((lead) => lead.city).filter(Boolean))].sort(),
    [source],
  );
  const visible = useMemo(() => {
    const needle = text.trim().toLowerCase();
    const maximumDistance =
      distanceFilter === "all"
        ? Number.POSITIVE_INFINITY
        : Number(distanceFilter);
    return source
      .filter((lead) => {
        const matchesText =
          `${lead.businessName} ${lead.address ?? ""} ${lead.category} ${lead.city ?? ""}`
            .toLowerCase()
            .includes(needle);
        return (
          matchesText &&
          (categoryFilter === "all" || lead.category === categoryFilter) &&
          (cityFilter === "all" || lead.city === cityFilter) &&
          (lead.distanceKm === undefined ||
            lead.distanceKm <= maximumDistance) &&
          (!contactFilters.has("phone") || Boolean(lead.phone)) &&
          (!contactFilters.has("email") ||
            Boolean(lead.email || lead.emails.length)) &&
          (!contactFilters.has("website") || Boolean(lead.website)) &&
          (!contactFilters.has("social") || lead.socials.length > 0) &&
          (!contactFilters.has("hours") || Boolean(lead.openingHours))
        );
      })
      .toSorted((a, b) => {
        if (sortBy === "name")
          return a.businessName.localeCompare(b.businessName);
        if (sortBy === "completeness")
          return (b.completenessScore ?? 0) - (a.completenessScore ?? 0);
        return (
          (a.distanceKm ?? Number.POSITIVE_INFINITY) -
          (b.distanceKm ?? Number.POSITIVE_INFINITY)
        );
      });
  }, [
    source,
    text,
    categoryFilter,
    cityFilter,
    distanceFilter,
    contactFilters,
    sortBy,
  ]);
  const chosen = source.filter((lead) => selected.has(lead.id));
  const withPhones = visible.filter((lead) => lead.phone).length;
  const withEmails = visible.filter(
    (lead) => (lead.emails?.length ?? 0) > 0,
  ).length;
  const withWebsites = visible.filter((lead) => lead.website).length;
  const toast = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 3500);
  };
  async function search(input: SearchInput) {
    setBusy(true);
    setLeads([]);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      const body = (await response.json()) as SearchResponse & {
        error?: string;
      };
      if (!response.ok) throw new Error(body.error);
      setLeads(body.leads);
      const entry = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        input,
        leads: body.leads,
      };
      await saveHistory(entry);
      setHistory(await readHistory());
      if (!body.leads.length)
        toast(
          "No mapped businesses found. Try a larger radius or another category.",
        );
    } catch (e) {
      toast(
        e instanceof DOMException && e.name === "AbortError"
          ? "The public map service took too long. Try a 5–10 km radius."
          : e instanceof Error
            ? e.message
            : "Search failed.",
      );
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }
  async function enrich(targets: BusinessLead[]) {
    if (!targets.length) return;
    setEnriching(new Set(targets.map((x) => x.id)));
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: targets }),
      });
      const body = (await response.json()) as {
        error?: string;
        results?: {
          id: string;
          emails: string[];
          socials: string[];
          phone?: string;
        }[];
      };
      if (!response.ok) throw new Error(body.error);
      const results = new Map(body.results?.map((r) => [r.id, r]));
      const merge = (items: BusinessLead[]) =>
        items.map((lead) => {
          const result = results.get(lead.id);
          return result
            ? { ...lead, ...result, phone: lead.phone ?? result.phone }
            : lead;
        });
      setLeads(merge);
      const next = merge(saved);
      setSaved(next);
      await saveSelected(next);
      toast("Public website contact scan complete.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Contact scan failed.");
    } finally {
      setEnriching(new Set());
    }
  }
  function toggle(lead: BusinessLead) {
    setSelected((old) => {
      const next = new Set(old);
      if (next.has(lead.id)) next.delete(lead.id);
      else next.add(lead.id);
      return next;
    });
  }
  return (
    <>
      <Header view={view} onView={setView} savedCount={saved.length} />
      <main>
        {view === "discover" && (
          <>
            <section className="hero">
              <div>
                <p className="kicker">OPEN-SOURCE PROSPECTING WORKSPACE</p>
                <h1>
                  Map a market. Build a <em>qualified lead list.</em>
                </h1>
                <p>
                  Discover public business listings worldwide, map nearby
                  prospects, enrich public website contacts, and export your
                  shortlist.
                </p>
              </div>
              <div className="hero-proof">
                <span>No login</span>
                <span>No paid data API</span>
                <span>Local-first storage</span>
              </div>
            </section>
            <SearchForm busy={busy} onSearch={search} />
            <div className="utility-bar">
              <div>
                <strong>Already have a list?</strong>
                <span>
                  Import a CSV containing business names, phones, websites,
                  addresses, and coordinates.
                </span>
              </div>
              <div className="utility-actions">
                <button onClick={() => setAddingBusiness(true)}>
                  + Add business
                </button>
                <button onClick={() => importInput.current?.click()}>
                  Import CSV
                </button>
              </div>
              <input
                ref={importInput}
                type="file"
                accept=".csv,text/csv"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (
                    file.size > 5_000_000 ||
                    !file.name.toLowerCase().endsWith(".csv")
                  ) {
                    toast("Choose a CSV file smaller than 5 MB.");
                    event.target.value = "";
                    return;
                  }
                  void file.text().then((contents) => {
                    const imported = importLeadsCsv(contents);
                    setLeads(imported);
                    setView("discover");
                    toast(`${imported.length} records imported.`);
                  });
                }}
              />
            </div>
            {busy && (
              <div className="progress-card">
                <span className="search-spinner" aria-hidden="true" />
                <span>
                  <strong>Searching public map data</strong>
                  <small>
                    Usually 5–20 seconds. A smaller radius is faster.
                  </small>
                </span>
              </div>
            )}
          </>
        )}
        {view === "about" && (
          <section className="page-panel">
            <h1>Privacy-first local prospecting</h1>
            <p>
              LeadForge uses OpenStreetMap and a local GeoNames city index.
              Searches and saved leads remain in IndexedDB in this browser.
              Contact discovery visits only a listing’s public website and
              blocks private network destinations.
            </p>
            <p>
              <a href="/about/data">Read about data sources and attribution</a>
            </p>
            <button
              onClick={() =>
                void clearLocalData().then(() => {
                  setSaved([]);
                  setHistory([]);
                  toast("Local data cleared.");
                })
              }
            >
              Clear local data
            </button>
          </section>
        )}
        {view !== "about" && source.length > 0 && (
          <section className="results-section">
            <div className="results-head">
              <div>
                <p className="kicker">
                  {view === "saved" ? "SAVED LOCALLY" : "RESULTS"}
                </p>
                <h2>
                  {visible.length}{" "}
                  {visible.length === 1 ? "business" : "businesses"}
                </h2>
                <p>
                  OpenStreetMap data may be incomplete. Verify details before
                  outreach.
                </p>
              </div>
              <div className="result-actions">
                <button
                  onClick={() => void enrich(chosen)}
                  disabled={!chosen.length || enriching.size > 0}
                >
                  Find contacts ({chosen.length})
                </button>
                <button onClick={() => downloadCsv(visible, "leadforge.csv")}>
                  Export all
                </button>
                <button
                  disabled={!chosen.length}
                  onClick={() => downloadCsv(chosen, "leadforge-selected.csv")}
                >
                  Export selected
                </button>
                <button
                  onClick={() => downloadGeoJson(visible, "leadforge.geojson")}
                >
                  GeoJSON
                </button>
                <button
                  disabled={!withPhones}
                  onClick={() =>
                    downloadCsv(
                      visible.filter((lead) => lead.phone),
                      "leadforge-phones.csv",
                    )
                  }
                >
                  Phone list
                </button>
                <button
                  disabled={!withEmails}
                  onClick={() =>
                    downloadCsv(
                      visible.filter((lead) => (lead.emails?.length ?? 0) > 0),
                      "leadforge-emails.csv",
                    )
                  }
                >
                  Email list
                </button>
                {(["list", "split", "map"] as const).map((item) => (
                  <button
                    key={item}
                    className={mode === item ? "active" : ""}
                    onClick={() => setMode(item)}
                    aria-pressed={mode === item}
                  >
                    {item === "list"
                      ? "List"
                      : item === "split"
                        ? "List + map"
                        : "Map"}
                  </button>
                ))}
              </div>
            </div>
            <div className="result-stats">
              <article>
                <span>Total businesses</span>
                <strong>{visible.length}</strong>
              </article>
              <article>
                <span>Phone numbers</span>
                <strong>{withPhones}</strong>
              </article>
              <article>
                <span>Websites</span>
                <strong>{withWebsites}</strong>
              </article>
              <article>
                <span>Emails found</span>
                <strong>{withEmails}</strong>
              </article>
            </div>
            <div className="filters" aria-label="Result filters">
              <input
                type="search"
                placeholder="Search name or address…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Category filter"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                aria-label="City filter"
              >
                <option value="all">All cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <select
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value)}
                aria-label="Distance filter"
              >
                <option value="all">Any distance</option>
                {[5, 10, 25, 50].map((distance) => (
                  <option key={distance} value={distance}>
                    Within {distance} km
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort results"
              >
                <option value="distance">Nearest first</option>
                <option value="name">Business name</option>
                <option value="completeness">Most complete</option>
              </select>
              {contactFilterOptions.map(([id, label]) => (
                <label className="check-filter" key={id}>
                  <input
                    type="checkbox"
                    checked={contactFilters.has(id)}
                    onChange={() =>
                      setContactFilters((current) => {
                        const next = new Set(current);
                        if (next.has(id)) next.delete(id);
                        else next.add(id);
                        return next;
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <div
              className={`results-grid ${mode === "split" ? "with-map" : ""} ${mode === "map" ? "map-only" : ""}`}
            >
              {mode !== "map" && (
                <div>
                  <LeadList
                    leads={visible}
                    selected={selected}
                    enriching={enriching}
                    activeId={activeId}
                    onSelect={toggle}
                    onEnrich={(items) => void enrich(items)}
                    onFocus={setActiveId}
                  />
                  {view === "discover" && (
                    <div className="save-strip">
                      <span>Save selected leads in this browser</span>
                      <button
                        disabled={!chosen.length}
                        onClick={() => {
                          const map = new Map(saved.map((x) => [x.id, x]));
                          chosen.forEach((x) => map.set(x.id, x));
                          const next = [...map.values()];
                          setSaved(next);
                          void saveSelected(next);
                          toast("Saved locally.");
                        }}
                      >
                        Save ({chosen.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
              {mode !== "list" && (
                <LeadMapLoader
                  leads={visible}
                  activeId={activeId}
                  onFocus={setActiveId}
                />
              )}
            </div>
            <DataAttribution />
          </section>
        )}
        {view === "saved" && !saved.length && (
          <section className="page-panel">
            <h1>No saved leads yet</h1>
            <p>Select businesses in Discover and save them here.</p>
            {history.length > 0 && (
              <p>{history.length} recent searches are stored locally.</p>
            )}
          </section>
        )}
      </main>
      <CustomBusinessForm
        open={addingBusiness}
        onClose={() => setAddingBusiness(false)}
        onAdd={(lead) => {
          setLeads((current) => [lead, ...current]);
          setSaved((current) => {
            const next = [
              lead,
              ...current.filter((item) => item.id !== lead.id),
            ];
            void saveSelected(next);
            return next;
          });
          setView("discover");
          setMode("split");
          setActiveId(lead.id);
          toast("Custom business added and saved locally.");
        }}
      />
      <footer className="site-footer">
        <div>
          <span className="footer-mark">LF</span>
          <div>
            <strong>LeadForge</strong>
            <small>Open-source business discovery</small>
          </div>
        </div>
        <nav>
          <a href="/about/data">Data &amp; attribution</a>
          <a
            href={
              process.env.NEXT_PUBLIC_GITHUB_URL ??
              "https://github.com/MuhammadMuneeb007/LeadForge"
            }
            target="_blank"
            rel="noreferrer"
          >
            GitHub repository ↗
          </a>
        </nav>
        <p>
          Use public business data responsibly. Verify details before outreach.
        </p>
      </footer>
      <div className={`toast ${notice ? "show" : ""}`} role="status">
        {notice}
      </div>
    </>
  );
}
