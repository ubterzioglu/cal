// Single source of truth for public, indexable routes.
// Consumed by the app (src/seo/routes.ts), the sitemap generator,
// and the prerender step. Keep this as plain JS so Node tooling can
// import it without a TypeScript loader.
//
// changefreq/priority are sitemap hints. Detail routes with dynamic
// (Supabase) slugs are intentionally excluded from prerender + sitemap.

export const PUBLIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/contact", changefreq: "yearly", priority: 0.5 },
  { path: "/gizlilik-politikasi", changefreq: "yearly", priority: 0.3 },
  { path: "/cerez-politikasi", changefreq: "yearly", priority: 0.3 },
  { path: "/kullanim-sartlari", changefreq: "yearly", priority: 0.3 },
  { path: "/acik-riza", changefreq: "yearly", priority: 0.3 },
  { path: "/kvkk", changefreq: "yearly", priority: 0.3 },
];

// Routes that should NOT be indexed (auth-gated / operational).
// news/clubs/etkinlikler/takimlar/mezun-dayanisma require a logged-in +
// completed profile (RequireProfile guard in src/App.tsx) — a logged-out
// crawler only ever sees the login redirect, so they must not be prerendered,
// sitemapped, or indexed as if they were public content.
export const PRIVATE_ROUTES = [
  "/students",
  "/alumni",
  "/login",
  "/admin",
  "/profil",
  "/news",
  "/clubs",
  "/etkinlikler",
  "/takimlar",
  "/mezun-dayanisma",
];
