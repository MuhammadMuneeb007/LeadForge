"use client";
import type { BusinessLead } from "@/types/lead";
export function LeadCard({
  lead,
  selected,
  enriching,
  active,
  onSelect,
  onEnrich,
  onFocus,
}: {
  lead: BusinessLead;
  selected: boolean;
  enriching: boolean;
  active: boolean;
  onSelect: () => void;
  onEnrich: () => void;
  onFocus: () => void;
}) {
  return (
    <article
      className={`lead-card ${active ? "focused" : ""}`}
      onClick={onFocus}
    >
      <div className="lead-top">
        <div>
          <span className="category-tag">
            {lead.category.replaceAll("_", " ")}
          </span>
          <h3>{lead.businessName}</h3>
          <p>{lead.address ?? `${lead.city}, ${lead.country}`}</p>
        </div>
        <label className="select-lead" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={selected} onChange={onSelect} />{" "}
          Select
        </label>
      </div>
      <div className="lead-meta">
        <span>{lead.distanceKm?.toFixed(1)} km away</span>
        <span>{lead.phone ?? "No phone listed"}</span>
        <span>Completeness {lead.completenessScore ?? 0}%</span>
      </div>
      {lead.openingHours && <p>{lead.openingHours}</p>}
      {(lead.emails?.length ?? 0) > 0 && (
        <p className="emails">{lead.emails?.join(" · ")}</p>
      )}
      <div className="lead-actions">
        {lead.website && (
          <a
            href={lead.website}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Website ↗
          </a>
        )}
        <a
          href={lead.mapsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          OSM ↗
        </a>
        <button
          disabled={enriching || !lead.website}
          onClick={(e) => {
            e.stopPropagation();
            onEnrich();
          }}
        >
          {enriching ? "Scanning…" : "Find public contacts"}
        </button>
      </div>
    </article>
  );
}
