// Single source of truth for public, indexable routes.
// Consumed by the app (src/seo/routes.ts), the sitemap generator,
// and the prerender step. Keep this as plain JS so Node tooling can
// import it without a TypeScript loader.
//
// changefreq/priority are sitemap hints. Detail routes with dynamic
// (Supabase) slugs are intentionally excluded from prerender + sitemap.

export const PUBLIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/news", changefreq: "weekly", priority: 0.8 },
  { path: "/clubs", changefreq: "monthly", priority: 0.7 },
  { path: "/etkinlikler", changefreq: "weekly", priority: 0.7 },
  { path: "/takimlar", changefreq: "monthly", priority: 0.7 },
  { path: "/mezun-dayanisma", changefreq: "weekly", priority: 0.6 },
  { path: "/contact", changefreq: "yearly", priority: 0.5 },
  { path: "/gizlilik-politikasi", changefreq: "yearly", priority: 0.3 },
  { path: "/cerez-politikasi", changefreq: "yearly", priority: 0.3 },
  { path: "/kullanim-sartlari", changefreq: "yearly", priority: 0.3 },
  { path: "/acik-riza", changefreq: "yearly", priority: 0.3 },
  { path: "/kvkk", changefreq: "yearly", priority: 0.3 },
];

// Routes that should NOT be indexed (auth-gated / operational).
export const PRIVATE_ROUTES = [
  "/students",
  "/alumni",
  "/login",
  "/admin",
];
