import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import '@/styles/globals.css'
import { siteConfig } from '@/lib/siteConfig'
import { Header, Footer, HashScroll } from '@/components/layout'
import { ContactModal } from '@/components/contact'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Simplefysed Solutions | Software and AI Engineering',
    template: '%s | Simplefysed Solutions',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'software development',
    'AI engineering',
    'automation',
    'web development',
    'mobile apps',
    'AI solutions',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  // No canonical / og:url here: both would inherit into every child route and
  // point them at the homepage. Each page sets its own via pageMetadata().
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#F3F0E9',
}

// Brand entity for search engines. Does not create sitelinks (those are
// algorithmic) but strengthens the brand SERP: logo, knowledge panel, and the
// standard companion signal to sitelinks. Rendered site-wide so it is present
// on the home page that ranks for the "simplefysed" query.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon-512.png`,
  description: siteConfig.description,
  email: 'info@simplefysed.com',
  founder: { '@type': 'Person', name: 'Vin Mangelsdorf' },
  sameAs: [
    'https://www.linkedin.com/in/vin-m-587a70256/',
    'https://www.instagram.com/vin696',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Font variables live on <html>: globals.css consumes them inside :root,
    // where body-level custom properties are not visible.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <HashScroll />
        <Header />
        <main>{children}</main>
        <Footer />
        <ContactModal />
        <Analytics />
      </body>
    </html>
  )
}
