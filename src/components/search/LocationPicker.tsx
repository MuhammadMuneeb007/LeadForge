"use client";
import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import type { GeoJSONSource, Map, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  latitude: number;
  longitude: number;
  radiusKm: number;
  onChange: (latitude: number, longitude: number) => void;
};
function circle(latitude: number, longitude: number, radiusKm: number) {
  const coordinates: [number, number][] = [];
  const latRadius = radiusKm / 111.32;
  const lonRadius = radiusKm / (111.32 * Math.cos((latitude * Math.PI) / 180));
  for (let angle = 0; angle <= 360; angle += 6) {
    const radians = (angle * Math.PI) / 180;
    coordinates.push([
      longitude + lonRadius * Math.cos(radians),
      latitude + latRadius * Math.sin(radians),
    ]);
  }
  return {
    type: "Feature" as const,
    properties: {},
    geometry: { type: "Polygon" as const, coordinates: [coordinates] },
  };
}
export function LocationPicker({
  latitude,
  longitude,
  radiusKm,
  onChange,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const markerRef = useRef<Marker>(null);
  const changeRef = useRef(onChange);
  const initial = useRef({ latitude, longitude, radiusKm });
  useEffect(() => {
    changeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    if (!container.current) return;
    const start = initial.current;
    const map = new maplibregl.Map({
      container: container.current,
      style:
        process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
        "https://tiles.openfreemap.org/styles/liberty",
      center: [start.longitude, start.latitude],
      zoom: 10,
    });
    mapRef.current = map;
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => map.resize());
    });
    resizeObserver.observe(container.current);
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => {
      map.addSource("radius", {
        type: "geojson",
        data: circle(start.latitude, start.longitude, start.radiusKm),
      });
      map.addLayer({
        id: "radius-fill",
        type: "fill",
        source: "radius",
        paint: { "fill-color": "#1c6b53", "fill-opacity": 0.13 },
      });
      map.addLayer({
        id: "radius-line",
        type: "line",
        source: "radius",
        paint: { "line-color": "#1c6b53", "line-width": 2 },
      });
      const marker = new maplibregl.Marker({
        color: "#e36f45",
        draggable: true,
      })
        .setLngLat([start.longitude, start.latitude])
        .addTo(map);
      markerRef.current = marker;
      marker.on("dragend", () => {
        const point = marker.getLngLat();
        changeRef.current(point.lat, point.lng);
      });
      map.on("click", (event) =>
        changeRef.current(event.lngLat.lat, event.lngLat.lng),
      );
    });
    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    (map.getSource("radius") as GeoJSONSource | undefined)?.setData(
      circle(latitude, longitude, radiusKm),
    );
    markerRef.current?.setLngLat([longitude, latitude]);
    map.easeTo({ center: [longitude, latitude], duration: 500 });
  }, [latitude, longitude, radiusKm]);
  return (
    <div
      className="location-map"
      ref={container}
      aria-label="Search center map"
    />
  );
}
