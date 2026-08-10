"use client";
import dynamic from "next/dynamic";
const Picker = dynamic(
  () => import("./LocationPicker").then((module) => module.LocationPicker),
  {
    ssr: false,
    loading: () => <div className="location-map map-loading">Loading map…</div>,
  },
);
export const LocationPickerLoader = Picker;
