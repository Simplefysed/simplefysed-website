import { solutions } from './solutions'

export interface CaseStudyMetric {
  value: string
  label: string
}

// Case studies are categorized by the productized solution they demonstrate
// (see data/solutions.ts). Keep these titles in sync with the solution titles.
export type CaseStudyCategory =
  | 'Operations Engineering'
  | 'Product Engineering'
  | 'AI Augmentation'

export interface CaseStudy {
  slug: string
  company: string
  title: string
  tagline: string // short, curiosity-driven subtitle for the detail hero
  category: CaseStudyCategory
  description: string // longer summary: listing card + OG description
  challenge: string
  solution: string
  results: string[]
  metrics: CaseStudyMetric[]
  tech: string[]
  visitUrl?: string // external live site, optional
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'mietservice24',
    company: 'Mietservice24',
    title: 'Equipment Rental Platform',
    tagline: 'The rental business that outgrew the phone, and started taking bookings in its sleep.',
    category: 'Product Engineering',
    description:
      'Built a full-stack booking platform that replaced an entirely manual phone-and-WhatsApp workflow with 24/7 online self-service for a regional equipment rental business.',
    visitUrl: 'https://www.mietservice24.com/',
    challenge:
      'Lück Mietservice 24 rents heavy equipment (trucks with cranes, lifting platforms, trench cutters, and wood chippers) across Brandenburg, Germany. Every booking relied on phone calls during business hours, manual calendar checks, and hand-written WhatsApp confirmations. There was no online presence, no self-service, no structured records, and no way to prevent double-bookings.',
    solution:
      'We built a full-stack Next.js platform with an interactive calendar showing real-time availability from Supabase, a self-service booking flow with automated email confirmations via Resend, and one-click admin action links that eliminated all manual data entry. The platform also includes GDPR-compliant legal pages (Impressum, Datenschutz, AGB) required for German businesses.',
    results: [
      'Enabled 24/7 online booking so customers are no longer limited to business-hours phone calls',
      'Eliminated all manual data entry with structured forms stored directly in PostgreSQL',
      'Real-time interactive calendar prevents double-bookings automatically',
      'One-click email-based admin workflow to confirm or cancel bookings without a dashboard',
      'Full legal compliance with GDPR privacy policy, Impressum, and AGB from day one',
    ],
    metrics: [
      { label: 'Booking', value: '24/7' },
      { label: 'Availability', value: 'Real-time' },
      { label: 'Email Templates', value: '6' },
    ],
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Resend', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'n8n-inquiry-automation',
    company: 'French Hotel Evaluation Firm',
    title: 'AI Email Inquiry Automation',
    tagline: 'The inbox that answers itself, sorting every inquiry and drafting the documents on its own.',
    category: 'Operations Engineering',
    description:
      'Built an automated workflow that uses AI to classify incoming email inquiries, extract structured data, and auto-generate evaluation documents from Word templates for a hotel evaluation firm.',
    challenge:
      'The client, a French hotel evaluation company, receives a high volume of project inquiry emails from hotel owners and operators. Each inquiry needs to be reviewed, categorized by project type, and formatted into a standardized evaluation document using the correct Word template before being passed to the internal team. This entire process was manual: staff read every email, decided the category, copy-pasted relevant details into Word documents, and forwarded them. It was slow, error-prone, and didn\'t scale.',
    solution:
      'We designed and built an n8n workflow automation that connects to the client\'s email mailbox via IMAP, then pipes each incoming message through OpenAI\'s ChatGPT. The AI first determines whether the email is a genuine project inquiry or noise. For valid inquiries, it classifies the email into the appropriate category (matching the client\'s internal project types), extracts all relevant named fields (company name, hotel details, contact information, project scope, etc.), and outputs structured JSON. That JSON is then injected into the correct Word template using a REST API integration, producing a pre-filled evaluation document. The completed document is automatically sent to the client\'s evaluation team, ready for review.',
    results: [
      'Eliminated manual email triage so every incoming message is automatically screened and classified by AI',
      'Reduced document preparation from 15 to 20 minutes per inquiry to fully automated generation in seconds',
      'AI-powered category detection selects the correct Word template without human intervention',
      'Structured JSON extraction ensures consistent, error-free data formatting across all documents',
      'Seamless handoff to the evaluation team with pre-filled documents ready for immediate review',
    ],
    metrics: [
      { label: 'Processing', value: 'Fully Auto' },
      { label: 'Triage Speed', value: 'Seconds' },
      { label: 'Classification', value: 'AI-Powered' },
    ],
    tech: ['n8n', 'OpenAI', 'IMAP', 'REST API', 'Word Templates'],
  },
  {
    slug: 'mandateos',
    company: 'MandateOS',
    title: 'Campaign Operating System',
    tagline:
      'The political campaign that traded five WhatsApp groups and paper lists for one shared system.',
    category: 'Product Engineering',
    description:
      'Built a cross-platform campaign operating system for German elections: a web command center for leadership and native iOS and Android apps for field volunteers, all on one privacy-compliant shared backend.',
    visitUrl: 'https://mandateos.de',
    challenge:
      'A political campaign rarely fails for lack of enthusiasm. It fails when information gets lost. Poster locations live in one volunteer\'s head instead of on a shared list, helpers are scattered across five WhatsApp groups, some streets get flyered twice while others are missed, and the budget goes unwatched until it is too late. German campaigns also run under strict data-protection and party-finance law, so the usual patchwork of chat groups, spreadsheets, and paper lists is not just messy, it is a legal liability.',
    solution:
      'We built MandateOS as one product across three clients on a single shared backend: a Next.js web command center for candidates and campaign leadership, and native iOS and Android apps (Expo, React Native) for volunteers in the field. One EU-region Supabase backend is the source of truth, enriching every session with the user\'s active campaign and role and enforcing row-level security so no client can overreach. Leadership plans poster locations on an interactive map, draws districts into printable run-cards, and tracks spending with a tool aligned to German party-finance law; volunteers record walked routes with a real-time Kalman-filtered GPS so the distance shown live matches the distance saved, capture poster conditions with a photo and a pin, and log door sentiment. The whole interface re-skins itself to the campaign\'s party, and two deliberately narrow, opt-in AI features run for well under a euro per campaign per year.',
    results: [
      'Unified a campaign onto one shared data foundation across web and mobile, replacing scattered WhatsApp groups, spreadsheets, and paper lists',
      'Shipped three clients, a web command center plus native iOS and Android apps, on a single EU-region backend that treats its own database as the source of truth',
      'Field volunteers track walked routes with a real-time constant-velocity Kalman filter, so the distance shown live matches the distance saved',
      'Leadership plans on an interactive map, draws territories into printable run-cards, and tracks spending with a tool aligned to German party-finance law',
      'The entire interface re-skins itself to any of five political parties through server-rendered theme variables',
      'GDPR compliant by design: consent audit trails, explicit political-data consent, anonymized field data, self-service export and deletion, and EU data residency',
    ],
    metrics: [
      { label: 'Platforms', value: '3' },
      { label: 'Party Themes', value: '5' },
      { label: 'Data Residency', value: 'EU' },
      { label: 'AI Cost / Year', value: '< €1' },
    ],
    tech: ['Next.js', 'React Native', 'Expo', 'TypeScript', 'Supabase', 'Leaflet', 'OpenAI', 'Tailwind CSS'],
  },
  {
    slug: 'bondura-cura',
    company: 'Bondura Cura',
    title: 'Guided Program Platform',
    tagline:
      'The self-help program no course platform could hold, so we built it a home of its own.',
    category: 'Product Engineering',
    description:
      'Built a bespoke platform for a guided German self-help program that no course tool could host: cohort-paced weekly video, a private trauma-sensitive community, and integrated payments, all on one owned EU system.',
    visitUrl: 'https://bonduracura.de',
    challenge:
      'Bondura Cura is a guided self-help program from a German practitioner, a paced journey through the recurring patterns in people\'s closest relationships. No course platform on the market could hold it. Its sensitive, trauma-adjacent nature ruled out US-hosted tools after Schrems II, and it ruled out the engagement mechanics every platform ships, the streaks, likes, and leaderboards that are exactly wrong for this kind of work. The program also needed things no off-the-shelf tool combines: weekly video that unlocks with the cohort instead of all at once, a community where moving forward hides the stage you left behind, reflections no one but their author can read, pseudonyms by default, a single purchase instead of a rolling subscription, and one unbroken brand from the landing page to the last lesson. Before us it was a marketing site with no login, no payments, and no video, and a community renting space on Discord.',
    solution:
      'We built Bondura Cura as one owned system: a single Next.js application on an EU-region Supabase backend with row-level security, carrying the same calm cream brand from the marketing page through checkout, the member cockpit, and the community, so there is never a platform-switch moment. Content unlocks on a weekly rhythm the database computes from each cohort\'s start date, and lessons within a week open in order, so no one is buried under everything at once or running ahead of the shared conversation. The private community runs on Supabase Realtime under pseudonyms, gives every cohort its own channel, and hides earlier stages once a member moves on; personal reflections stay readable only to their author, not even to the founder. Stripe handles a one-time or five-part payment and grants five years of access through a signed webhook, Bunny Stream serves the video from Europe, and an admin studio lets the founder build weeks, reorder lessons by hand, and sync video without touching code. There are no streaks, no likes, and no leaderboards, on purpose.',
    results: [
      'Replaced every off-the-shelf course platform with one owned system, carrying a single unbroken brand from the landing page through checkout, cockpit, and community',
      'Weekly video unlocks on a cadence the database computes from each cohort\'s start date, with lessons opening in order so no one is overwhelmed or ahead of the shared conversation',
      'A private cohort community on Supabase Realtime with pseudonyms and per-cohort channels, where earlier stages hide once a member moves on to guard against relapse',
      'Personal reflections stay readable only to their author, not even to the founder, a trust guarantee built into the data model',
      'Integrated Stripe payments (one-time or five installments) grant five years of access through a signed, idempotent webhook, with an admin studio to build weeks and sync video without code',
      'One hundred percent EU-hosted and GDPR-compliant, and deliberately free of the streaks, likes, and leaderboards that are contraindicated for trauma-sensitive work',
    ],
    metrics: [
      { label: 'Stages', value: '6' },
      { label: 'Access', value: '5 Years' },
      { label: 'Data Residency', value: 'EU' },
      { label: 'Weeks / Stage', value: '~20' },
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Stripe', 'Bunny Stream', 'Resend', 'Tailwind CSS'],
  },
]

// Filter items mirror the three productized solutions (data/solutions.ts), in order.
export const caseStudyCategories: string[] = [
  'All',
  ...solutions.map((s) => s.title),
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug)
}
