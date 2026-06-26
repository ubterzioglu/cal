// Single source of truth for site-wide SEO/GEO constants.

export const SITE_URL = "https://calcom.club";
export const SITE_NAME = "CAL Community";
export const SITE_ALT_NAME = "Cağaloğlu Anadolu Lisesi Topluluğu";
export const SITE_LOCALE = "tr_TR";
export const SITE_LANG = "tr";

export const DEFAULT_TITLE = "CAL Community | Cağaloğlu Anadolu Lisesi Topluluğu";
export const DEFAULT_DESCRIPTION =
  "Cağaloğlu Anadolu Lisesi öğrenci ve mezunlarını bir araya getiren dijital topluluk platformu.";

export const OG_IMAGE_PATH = "/ogcal.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const TWITTER_HANDLE = "@CALCommunity";

// Organization identity used in JSON-LD.
export const ORGANIZATION = {
  name: SITE_NAME,
  alternateName: SITE_ALT_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  email: "ubterzioglu@gmail.com",
  // Public social/profile links, if any, go here (used as schema "sameAs").
  sameAs: [] as string[],
};

// Build an absolute canonical URL from a route path.
export function canonicalUrl(path: string): string {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
