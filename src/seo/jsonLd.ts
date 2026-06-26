// JSON-LD schema factories. Kept as plain objects so they can be
// stringified into <script type="application/ld+json"> tags.

import {
  ORGANIZATION,
  SITE_NAME,
  SITE_URL,
  canonicalUrl,
} from "./siteConfig";

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.alternateName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    email: ORGANIZATION.email,
    ...(ORGANIZATION.sameAs.length > 0 ? { sameAs: ORGANIZATION.sameAs } : {}),
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "tr-TR",
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export interface NewsArticleInput {
  headline: string;
  description: string;
  datePublished: string; // ISO 8601
}

export function newsArticleSchema(article: NewsArticleInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: ORGANIZATION.logo },
    },
  };
}

export function collectionPageSchema(name: string, path: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: canonicalUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}
