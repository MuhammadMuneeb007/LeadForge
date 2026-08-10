"use client";
import { useEffect, useRef } from "react";
import maplibregl, { type GeoJSONSource, type Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { BusinessLead } from "@/types/lead";
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
  useEffect(() => {
    callback.current = onFocus;
  }, [onFocus]);
  useEffect(() => {
    if (!container.current) return;
    const map = new maplibregl.Map({
      container: container.current,
      style:
        process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
        "https://tiles.openfreemap.org/styles/liberty",
      center: leads[0] ? [leads[0].longitude, leads[0].latitude] : [0, 20],
      zoom: leads.length ? 10 : 2,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => {
      map.addSource("leads", {
        type: "geojson",
        cluster: true,
        clusterRadius: 45,
        data: {
          type: "FeatureCollection",
          features: leads.map((lead) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lead.longitude, lead.latitude],
            },
            properties: { id: lead.id, name: lead.businessName },
          })),
        },
      });
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "leads",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#174c3c",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            25,
            24,
            100,
            30,
          ],
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
        id: "points",
        type: "circle",
        source: "leads",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#f4a261",
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#174c3c",
        },
      });
      map.on("click", "points", (event) => {
        const id = event.features?.[0]?.properties?.id as string;
        if (id) callback.current(id);
      });
      map.on("click", "clusters", async (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        const source = map.getSource("leads") as GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(
          feature.properties?.cluster_id,
        );
        const point = (feature.geometry as GeoJSON.Point).coordinates;
        map.easeTo({ center: point as [number, number], zoom });
      });
      if (leads.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        leads.forEach((lead) => bounds.extend([lead.longitude, lead.latitude]));
        map.fitBounds(bounds, { padding: 40, maxZoom: 13 });
      }
    });
    return () => map.remove();
  }, [leads]);
  useEffect(() => {
    const lead = leads.find((x) => x.id === activeId);
    if (lead)
      mapRef.current?.flyTo({
        center: [lead.longitude, lead.latitude],
        zoom: 15,
      });
  }, [activeId, leads]);
  return (
    <div className="map-shell">
      <div ref={container} style={{ height: "100%", minHeight: 520 }} />
    </div>
  );
}
