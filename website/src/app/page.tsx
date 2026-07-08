import { HeroSection } from '@/components/hero'
import { TechLogoSlider, ServicesSection } from '@/components/sections'
import { StudioSection } from '@/components/studio'
import { pageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/siteConfig'

export const metadata = pageMetadata({
  description: siteConfig.description,
  path: '/',
  ogTitle: 'Simplefysed Solutions | Software and AI Engineering',
})

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TechLogoSlider />
      <StudioSection />
    </>
  )
}
