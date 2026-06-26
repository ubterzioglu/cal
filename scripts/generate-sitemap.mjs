// Generates public/sitemap.xml from the canonical public-route list.
// Runs as part of the build (see package.json "build").

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PUBLIC_ROUTES } from "./public-routes.mjs";

const SITE_URL = "https://calcom.club";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "..", "public", "sitemap.xml");

const lastmod = new Date().toISOString().split("T")[0];

const toUrl = (route) => {
  const loc = route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${route.changefreq}</changefreq>`,
    `    <priority>${route.priority.toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n");
};

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PUBLIC_ROUTES.map(toUrl),
  "</urlset>",
  "",
].join("\n");

await writeFile(outputPath, xml, "utf-8");
console.log(`sitemap.xml written: ${PUBLIC_ROUTES.length} URLs → ${outputPath}`);
