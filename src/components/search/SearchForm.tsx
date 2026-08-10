"use client";
import { useEffect, useMemo, useState } from "react";
import { countries } from "@/lib/countries";
import { categories } from "@/lib/providers/osm/categories";
import { LocationPickerLoader } from "./LocationPickerLoader";
import type { CityRecord } from "@/data/cities/types";
import type { SearchInput } from "@/types/lead";

const brisbane: CityRecord = {
  id: "2174003",
  name: "Brisbane",
  asciiName: "Brisbane",
  latitude: -27.46794,
  longitude: 153.02809,
  countryCode: "AU",
  admin1: "Queensland",
  population: 2780063,
  timezone: "Australia/Brisbane",
};
export function SearchForm({
  busy,
  onSearch,
}: {
  busy: boolean;
  onSearch: (input: SearchInput) => void;
}) {
  const [countryCode, setCountry] = useState("AU");
  const [query, setQuery] = useState("Brisbane, Queensland");
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [city, setCity] = useState<CityRecord | undefined>(brisbane);
  const [latitude, setLatitude] = useState(brisbane.latitude);
  const [longitude, setLongitude] = useState(brisbane.longitude);
  const [selected, setSelected] = useState(["electronics"]);
  const [radiusKm, setRadius] = useState(10);
  const [resultLimit, setResultLimit] = useState(100);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const safeSelected = Array.isArray(selected) ? selected : [];
  const safeCities = Array.isArray(cities) ? cities : [];
  useEffect(() => {
    const controller = new AbortController();
    const cityQuery = city ? "" : (query ?? "").split(",")[0]!.trim();
    const timer = setTimeout(
      () =>
        fetch(
          `/api/cities?country=${countryCode}&q=${encodeURIComponent(cityQuery)}`,
          { signal: controller.signal },
        )
          .then((r) => r.json())
          .then((body: { cities: CityRecord[] }) => setCities(body.cities))
          .catch(() => {}),
      180,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, countryCode, city, cityMenuOpen]);
  const filtered = useMemo(
    () =>
      categories.filter((category) =>
        `${category.label} ${category.aliases.join(" ")}`
          .toLowerCase()
          .includes(categoryQuery.toLowerCase()),
      ),
    [categoryQuery],
  );
  const chooseCity = (item: CityRecord) => {
    setCity(item);
    setCountry(item.countryCode);
    setQuery(`${item.name}, ${item.admin1}`);
    setLatitude(item.latitude);
    setLongitude(item.longitude);
    setCities([]);
    setCityMenuOpen(false);
  };
  const toggle = (id: string) =>
    setSelected((items) =>
      (Array.isArray(items) ? items : []).includes(id)
        ? (Array.isArray(items) ? items : []).filter((item) => item !== id)
        : (Array.isArray(items) ? items : []).length < 3
          ? [...(Array.isArray(items) ? items : []), id]
          : Array.isArray(items)
            ? items
            : [],
    );
  const useLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        setLatitude(lat);
        setLongitude(lon);
        try {
          const body = (await fetch(`/api/cities?lat=${lat}&lon=${lon}`).then(
            (r) => r.json(),
          )) as { city?: CityRecord };
          if (body.city) chooseCity(body.city);
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };
  return (
    <form
      className="search-workspace"
      onSubmit={(event) => {
        event.preventDefault();
        if (city && safeSelected.length)
          onSearch({
            countryCode,
            cityId: city.id,
            categories: safeSelected,
            radiusKm,
            latitude,
            longitude,
            resultLimit,
          });
      }}
    >
      <section className="search-sidebar">
        <div className="workspace-heading">
          <span>01</span>
          <div>
            <p className="kicker">SEARCH CONFIGURATION</p>
            <h2>Define your market</h2>
          </div>
        </div>
        <div className="field-row">
          <label>
            Country
            <select
              value={countryCode}
              onChange={(event) => {
                setCountry(event.target.value);
                setCity(undefined);
                setQuery("");
                setCityMenuOpen(true);
              }}
            >
              {countries.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  suppressHydrationWarning
                >
                  {country.name}
                </option>
              ))}
            </select>
          </label>
          <label className="city-field">
            City or region
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCity(undefined);
                setCityMenuOpen(true);
              }}
              onFocus={() => setCityMenuOpen(true)}
              placeholder="Type a city name"
            />
            {cityMenuOpen && safeCities.length > 0 ? (
              <div className="city-options">
                {safeCities.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => chooseCity(item)}
                  >
                    <strong>{item.name}</strong>
                    <span>{item.admin1}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </label>
        </div>
        <button
          type="button"
          className="locate-button"
          onClick={useLocation}
          disabled={locating}
        >
          ◎ {locating ? "Detecting location…" : "Use my current location"}
        </button>
        <div className="range-block">
          <div>
            <label htmlFor="radius">Search radius</label>
            <output>{radiusKm} km</output>
          </div>
          <input
            id="radius"
            type="range"
            min="1"
            max="50"
            step="1"
            value={radiusKm}
            onChange={(event) => setRadius(Number(event.target.value))}
          />
          <div className="range-labels">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>
        <div className="range-block">
          <div>
            <label htmlFor="limit">Maximum businesses</label>
            <output>{resultLimit}</output>
          </div>
          <input
            id="limit"
            type="range"
            min="10"
            max="200"
            step="10"
            value={resultLimit}
            onChange={(event) => setResultLimit(Number(event.target.value))}
          />
          <div className="range-labels">
            <span>10</span>
            <span>200</span>
          </div>
        </div>
        <div className="category-section">
          <div className="section-label">
            <span>02</span>
            <div>
              <b>Business types</b>
              <small>Select up to three categories</small>
            </div>
          </div>
          <input
            type="search"
            value={categoryQuery}
            onChange={(event) => setCategoryQuery(event.target.value)}
            placeholder="Filter categories…"
          />
          <div className="compact-categories">
            {filtered.map((category) => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  checked={safeSelected.includes(category.id)}
                  onChange={() => toggle(category.id)}
                />
                <span>{category.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="selected-summary">
          <span>{safeSelected.length}/3 categories</span>
          <span>{radiusKm} km radius</span>
          <span>Up to {resultLimit} leads</span>
        </div>
        <button
          className="search-submit"
          disabled={busy || !city || !safeSelected.length}
        >
          {busy ? (
            <>
              <i className="search-spinner" />
              Searching map data…
            </>
          ) : (
            <>
              Search this area <b>→</b>
            </>
          )}
        </button>
      </section>
      <section className="location-panel">
        <div className="map-toolbar">
          <div>
            <p className="kicker">SEARCH AREA</p>
            <strong>
              {city ? `${city.name}, ${city.admin1}` : "Select a city"}
            </strong>
          </div>
          <span>
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </span>
        </div>
        <LocationPickerLoader
          latitude={latitude}
          longitude={longitude}
          radiusKm={radiusKm}
          onChange={(lat, lon) => {
            setLatitude(lat);
            setLongitude(lon);
          }}
        />
        <div className="map-hint">
          Click the map or drag the pin to reposition the search center.
        </div>
      </section>
    </form>
  );
}
