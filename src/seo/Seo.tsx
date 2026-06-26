import { Helmet } from "react-helmet-async";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE_URL,
  SITE_NAME,
  TWITTER_HANDLE,
  canonicalUrl,
} from "./siteConfig";

interface SeoProps {
  /** Page title. The site name is appended automatically unless this is the home page. */
  title?: string;
  description?: string;
  /** Route path used to build the canonical URL, e.g. "/news". */
  path: string;
  image?: string;
  type?: "website" | "article";
  /** When true, the page is excluded from search/AI indexing. */
  noindex?: boolean;
  /** One or more JSON-LD objects to embed. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = OG_IMAGE_URL,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoProps) => {
  const isHome = path === "/" || path === "";
  const fullTitle = !title
    ? DEFAULT_TITLE
    : isHome
      ? title
      : `${title} | ${SITE_NAME}`;
  const canonical = canonicalUrl(path);
  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
