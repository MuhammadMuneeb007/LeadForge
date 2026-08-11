"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { categories } from "@/lib/providers/osm/categories";
import { completenessScore } from "@/lib/scoring/score";
import type { BusinessLead } from "@/types/lead";

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .transform((value) => value || undefined);

const businessSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required.").max(200),
  category: z
    .string()
    .refine(
      (value) => categories.some((category) => category.id === value),
      "Choose a valid category.",
    ),
  city: z.string().trim().min(1, "City is required.").max(100),
  country: z.string().trim().min(1, "Country is required.").max(100),
  address: optionalText(500),
  phone: optionalText(100),
  email: z.union([z.literal(""), z.email("Enter a valid email address.")]),
  website: z
    .union([z.literal(""), z.url("Enter a complete website URL.")])
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Website must start with http:// or https://.",
    ),
  openingHours: optionalText(300),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export function CustomBusinessForm({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (lead: BusinessLead) => void;
}) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="business-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-business-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p className="kicker">MANUAL RECORD</p>
            <h2 id="custom-business-title">Add a custom business</h2>
            <p>Add a missing business to your current local lead list.</p>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <form
          className="business-form"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            const values = Object.fromEntries(
              new FormData(event.currentTarget),
            );
            const parsed = businessSchema.safeParse(values);
            if (!parsed.success) {
              setError(
                parsed.error.issues[0]?.message ??
                  "Check the business details.",
              );
              return;
            }
            const value = parsed.data;
            const id = crypto.randomUUID();
            const lead: BusinessLead = {
              id: `manual-${id}`,
              source: "manual",
              sourceId: id,
              businessName: value.businessName,
              category: value.category,
              city: value.city,
              country: value.country,
              address: value.address,
              phone: value.phone,
              email: value.email || undefined,
              emails: value.email ? [value.email.toLowerCase()] : [],
              website: value.website || undefined,
              socials: [],
              openingHours: value.openingHours,
              latitude: value.latitude,
              longitude: value.longitude,
              mapsUrl: `https://www.openstreetmap.org/?mlat=${value.latitude}&mlon=${value.longitude}`,
            };
            lead.completenessScore = completenessScore(lead);
            onAdd(lead);
            onClose();
          }}
        >
          <div className="business-form-grid">
            <label className="field-wide">
              Business name <b>*</b>
              <input name="businessName" autoFocus required maxLength={200} />
            </label>
            <label>
              Category <b>*</b>
              <select name="category" defaultValue="electronics" required>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              City <b>*</b>
              <input
                name="city"
                defaultValue="Brisbane"
                required
                maxLength={100}
              />
            </label>
            <label>
              Country <b>*</b>
              <input
                name="country"
                defaultValue="Australia"
                required
                maxLength={100}
              />
            </label>
            <label className="field-wide">
              Address
              <input
                name="address"
                placeholder="Street address"
                maxLength={500}
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                type="tel"
                placeholder="+61…"
                maxLength={100}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                placeholder="sales@example.com"
              />
            </label>
            <label className="field-wide">
              Website
              <input
                name="website"
                type="url"
                placeholder="https://example.com"
              />
            </label>
            <label>
              Latitude <b>*</b>
              <input
                name="latitude"
                type="number"
                step="any"
                min={-90}
                max={90}
                defaultValue="-27.46794"
                required
              />
            </label>
            <label>
              Longitude <b>*</b>
              <input
                name="longitude"
                type="number"
                step="any"
                min={-180}
                max={180}
                defaultValue="153.02809"
                required
              />
            </label>
            <label className="field-wide">
              Opening hours
              <input
                name="openingHours"
                placeholder="Mo-Fr 09:00-17:00"
                maxLength={300}
              />
            </label>
          </div>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <footer>
            <span>Stored locally—nothing is published to OpenStreetMap.</span>
            <div>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary">
                Add business
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
