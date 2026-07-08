export interface LinkItem {
  label: string
  sublabel?: string
  href: string
  external?: boolean
  primary?: boolean
  // Reserved for future sections on the /linktree page (e.g. 'Articles').
  group?: string
  // BCP 47 code of the destination page when it differs from the site
  // language; rendered as a visible note and an hreflang attribute.
  lang?: 'de'
}

export const linktreeLinks: LinkItem[] = [
  {
    label: 'Schedule a Call',
    sublabel: '30 minutes, straight to the calendar',
    href: 'https://calendly.com/vin-simplefysed/30min',
    external: true,
    primary: true,
  },
  {
    label: 'LinkedIn',
    sublabel: 'Connect with me',
    href: 'https://www.linkedin.com/in/vin-m-587a70256/',
    external: true,
  },
  {
    label: 'Simplefysed Solutions',
    sublabel: 'The company site',
    href: '/',
  },
  {
    label: 'About Me',
    sublabel: 'The story and the method',
    href: '/about#founder',
  },
  {
    label: 'Student Startup Pitches in Erfurt',
    sublabel: 'Volunteer pitch jury',
    href: 'https://www.unternehmerische-bildung-th.de/von-der-idee-zum-startup/',
    external: true,
    group: 'In the news',
    lang: 'de',
  },
  {
    label: 'Impact Battle West Thuringia',
    sublabel: 'Judging social ventures',
    href: 'https://www.unternehmerische-bildung-th.de/1-impact-battle-westthueringen/',
    external: true,
    group: 'In the news',
    lang: 'de',
  },
]
