import type { Metadata } from 'next'
import { siteConfig } from './siteConfig'

type OgType = 'website' | 'article' | 'profile'

interface PageMetadataInput {
  /** Page <title>. Omit to inherit the root layout's title.default (home page). */
  title?: string
  description: string
  /** Route path, e.g. '/about' or '/case-studies/mandateos'. Resolved against metadataBase. */
  path: string
  /** Full social title. Defaults to `${title} | ${siteConfig.name}`, or siteConfig.name when no title. */
  ogTitle?: string
  /** Social description. Defaults to `description`. */
  ogDescription?: string
  ogType?: OgType
  /** OG / Twitter image path. Defaults to the branded share card. */
  image?: string
}

// Builds a complete, self-referencing Metadata block for a route. Next.js
// inherits metadata from the root layout, and when a page sets its own
// `openGraph` it REPLACES the parent's wholesale (not a deep merge), so every
// page must emit a full block. Centralizing that here guarantees each route
// gets its OWN canonical + og:url instead of inheriting the homepage's.
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  ogType = 'website',
  image = siteConfig.ogImage,
}: PageMetadataInput): Metadata {
  const socialTitle = ogTitle ?? (title ? `${title} | ${siteConfig.name}` : siteConfig.name)
  const socialDescription = ogDescription ?? description

  return {
    ...(title ? { title } : {}),
    description,
    // Relative path; the root layout's metadataBase resolves it to absolute.
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      siteName: siteConfig.name,
      url: path,
      title: socialTitle,
      description: socialDescription,
      locale: siteConfig.locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: siteConfig.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: socialDescription,
      images: [image],
    },
  }
}
