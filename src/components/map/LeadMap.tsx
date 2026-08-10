"use client";
import { useCallback, useEffect, useRef } from "react";
import maplibregl, { type GeoJSONSource, type Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { BusinessLead } from "@/types/lead";

const collection = (
  leads: BusinessLead[],
  activeId?: string,
): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
  type: "FeatureCollection",
  features: leads
    .filter(
      (lead) =>
        Number.isFinite(lead.latitude) && Number.isFinite(lead.longitude),
    )
    .map((lead) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [lead.longitude, lead.latitude] },
      properties: {
        id: lead.id,
        name: lead.businessName,
        category: lead.category,
        address: lead.address ?? "",
        phone: lead.phone ?? "",
        active: lead.id === activeId ? 1 : 0,
      },
    })),
});
export function LeadMap({
  leads,
  activeId,
  onFocus,
}: {
  leads: BusinessLead[];
  activeId?: string;
  onFocus: (id: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const callback = useRef(onFocus);
  const leadsRef = useRef(leads);
  const activeRef = useRef(activeId);
  useEffect(() => {
    callback.current = onFocus;
  }, [onFocus]);
  useEffect(() => {
    leadsRef.current = leads;
    activeRef.current = activeId;
  }, [leads, activeId]);
  const fitAll = useCallback(() => {
    const map = mapRef.current;
    const mapped = leadsRef.current.filter(
      (lead) =>
        Number.isFinite(lead.latitude) && Number.isFinite(lead.longitude),
    );
    if (!map || !mapped.length) return;
    if (mapped.length === 1)
      map.flyTo({
        center: [mapped[0]!.longitude, mapped[0]!.latitude],
        zoom: 15,
      });
    else {
      const bounds = new maplibregl.LngLatBounds();
      mapped.forEach((lead) => bounds.extend([lead.longitude, lead.latitude]));
      map.fitBounds(bounds, { padding: 55, maxZoom: 14, duration: 700 });
    }
  }, []);
  useEffect(() => {
    if (!container.current) return;
    const initial = leadsRef.current;
    const map = new maplibregl.Map({
      container: container.current,
      style:
        process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
        "https://tiles.openfreemap.org/styles/liberty",
      center: initial[0]
        ? [initial[0].longitude, initial[0].latitude]
        : [153.02809, -27.46794],
      zoom: initial.length ? 11 : 9,
    });
    mapRef.current = map;
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => map.resize());
    });
    resizeObserver.observe(container.current);
    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      "top-right",
    );
    map.addControl(new maplibregl.FullscreenControl(), "top-right");
    map.on("load", () => {
      map.addSource("leads", {
        type: "geojson",
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 48,
        data: collection(leadsRef.current, activeRef.current),
      });
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "leads",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#2d7258",
            20,
            "#174c3c",
            75,
            "#e4875b",
          ],
          "circle-radius": ["step", ["get", "point_count"], 18, 20, 24, 75, 31],
          "circle-stroke-width": 3,
          "circle-stroke-color": "rgba(255,255,255,.9)",
        },
      });
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "leads",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 12,
        },
        paint: { "text-color": "#fff" },
      });
      map.addLayer({
        id: "point-halo",
        type: "circle",
        source: "leads",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": ["case", ["==", ["get", "active"], 1], 15, 10],
          "circle-color": "rgba(22,77,60,.14)",
        },
      });
      map.addLayer({
        id: "points",
        type: "circle",
        source: "leads",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "case",
            ["==", ["get", "active"], 1],
            "#e4875b",
            "#164d3c",
          ],
          "circle-radius": ["case", ["==", ["get", "active"], 1], 9, 6],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
      map.addLayer({
        id: "point-labels",
        type: "symbol",
        source: "leads",
        filter: ["!", ["has", "point_count"]],
        minzoom: 13,
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-offset": [0, 1.25],
          "text-anchor": "top",
          "text-max-width": 14,
        },
        paint: {
          "text-color": "#14251f",
          "text-halo-color": "#fff",
          "text-halo-width": 2,
        },
      });
      map.on("click", "clusters", async (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        const source = map.getSource("leads") as GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(
          feature.properties?.cluster_id,
        );
        map.easeTo({
          center: (feature.geometry as GeoJSON.Point).coordinates as [
            number,
            number,
          ],
          zoom,
        });
      });
      map.on("click", "points", (event) => {
        const id = String(event.features?.[0]?.properties?.id ?? "");
        const lead = leadsRef.current.find((item) => item.id === id);
        if (!lead) return;
        callback.current(id);
        const card = document.createElement("div");
        card.className = "map-popup-card";
        const title = document.createElement("strong");
        title.textContent = lead.businessName;
        const category = document.createElement("span");
        category.textContent = lead.category.replaceAll("_", " ");
        const address = document.createElement("p");
        address.textContent =
          lead.address ?? `${lead.city ?? ""}, ${lead.country ?? ""}`;
        card.append(title, category, address);
        if (lead.phone) {
          const phone = document.createElement("a");
          phone.href = `tel:${lead.phone}`;
          phone.textContent = lead.phone;
          card.append(phone);
        }
        if (lead.website) {
          const website = document.createElement("a");
          website.href = lead.website;
          website.target = "_blank";
          website.rel = "noreferrer";
          website.textContent = "Open website ↗";
          card.append(website);
        }
        new maplibregl.Popup({
          offset: 13,
          closeButton: true,
          maxWidth: "280px",
        })
          .setLngLat([lead.longitude, lead.latitude])
          .setDOMContent(card)
          .addTo(map);
      });
      for (const layer of ["clusters", "points"]) {
        map.on("mouseenter", layer, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layer, () => {
          map.getCanvas().style.cursor = "";
        });
      }
      fitAll();
    });
    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, [fitAll]);
  useEffect(() => {
    const source = mapRef.current?.getSource("leads") as
      | GeoJSONSource
      | undefined;
    source?.setData(collection(leads, activeId));
  }, [leads, activeId]);
  useEffect(() => {
    const lead = leads.find((item) => item.id === activeId);
    if (lead)
      mapRef.current?.flyTo({
        center: [lead.longitude, lead.latitude],
        zoom: 15,
        duration: 650,
      });
  }, [activeId, leads]);
  return (
    <div className="map-shell">
      <div className="results-map-toolbar">
        <div>
          <strong>{leads.length}</strong>
          <span>business nodes</span>
        </div>
        <div className="map-legend">
          <i />
          Business <i />
          Selected
        </div>
        <button onClick={fitAll}>Fit all</button>
      </div>
      <div ref={container} className="results-map-canvas" />
      <div className="map-instruction">
        Click a node for details · click a cluster to expand
      </div>
    </div>
  );
}
