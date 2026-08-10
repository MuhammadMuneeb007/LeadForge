export function DataAttribution({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? "attribution attribution-compact" : "attribution"}>
      Business data ©{" "}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        OpenStreetMap contributors
      </a>{" "}
      (ODbL). City data ©{" "}
      <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">
        GeoNames
      </a>
      . Basemap ©{" "}
      <a href="https://openfreemap.org/" target="_blank" rel="noreferrer">
        OpenFreeMap
      </a>
      . Coverage varies by location.
    </p>
  );
}
