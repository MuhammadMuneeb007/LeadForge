import { unzipSync } from "fflate";
import { writeFile } from "node:fs/promises";
import { parseAdmin1, parseCities } from "../src/lib/geonames/parse";
const decoder = new TextDecoder();
const [zipResponse, adminResponse] = await Promise.all([
  fetch("https://download.geonames.org/export/dump/cities5000.zip"),
  fetch("https://download.geonames.org/export/dump/admin1CodesASCII.txt"),
]);
if (!zipResponse.ok || !adminResponse.ok)
  throw new Error("GeoNames download failed.");
const files = unzipSync(new Uint8Array(await zipResponse.arrayBuffer()));
const cityFile = files["cities5000.txt"];
if (!cityFile) throw new Error("cities5000.txt missing.");
const cities = parseCities(
  decoder.decode(cityFile),
  parseAdmin1(await adminResponse.text()),
);
await writeFile(
  new URL("../src/data/cities/cities.json", import.meta.url),
  JSON.stringify(cities),
);
console.log(`Wrote ${cities.length} GeoNames cities.`);
