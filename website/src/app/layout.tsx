import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Header, Footer } from '@/components/layout'
import { ContactModal } from '@/components/contact'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
})

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

export const metadata: Metadata = {
  title: 'Simplefysed Solutions | Intelligent Software Development',
  description: 'Building the future with cutting-edge web applications, mobile experiences, and AI solutions that transform businesses.',
  keywords: ['software development', 'web development', 'mobile apps', 'AI solutions', 'machine learning'],
  authors: [{ name: 'Simplefysed Solutions' }],
  openGraph: {
    title: 'Simplefysed Solutions',
    description: 'Building the future with intelligent software solutions.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <ContactModal />
      </body>
    </html>
  )
}
