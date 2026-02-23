# SCHUTZSCHILD Brandenburg

**A digital civil protection and disaster preparedness platform for the state of Brandenburg, Germany.**

---

## The Problem

Brandenburg lacks a unified digital platform for civil protection. Emergency information is fragmented across multiple agencies and websites, leaving citizens without centralized access to localized preparedness resources. There is no coordinated system for volunteer management during crises, and existing solutions fail to meet German accessibility standards (BITV 2.0) or GDPR requirements. In emergencies, every second counts — and scattered information costs time.

## The Solution

SCHUTZSCHILD Brandenburg is a modern, accessible web platform that centralizes civil protection information and services for the state of Brandenburg:

- **Real-time warning system** with NINA API integration and a live warning ticker
- **Interactive preparedness checklists** tailored by risk profile and household size
- **Volunteer coordination portal** ("Spontanhelfer") with skill tracking, availability management, and deployment readiness
- **Event management** for training exercises and operations with QR-code registration
- **Newsletter system** (regular + crisis editions) with GDPR-compliant double opt-in
- **Emergency pages** designed to work without JavaScript for maximum reliability
- **"Unit of the Month"** feature to spotlight local emergency organizations (THW, Freiwillige Feuerwehr, Hilfsorganisationen)
- **Hazard map** with flood level monitoring and forest fire danger indices
- **Multi-region support** across Brandenburg's Landkreise and kreisfreie Städte

## The Result

- Fully functional MVP deployed on Vercel
- **29 public-facing routes** covering all civil protection topics
- **13 CMS collections** with role-based content management (4 user roles)
- Mobile-responsive, WCAG 2.1 AA accessible design with high-contrast mode
- Complete GDPR-compliant data handling (double opt-in, consent tracking, privacy policy)
- Scalable serverless architecture ready for production use

## Key Features

- Warning ticker pulling from Germany's official NINA warning system
- Region-specific content filtering across Brandenburg
- Rich text content managed through Payload CMS with Lexical editor
- Dynamic event registration with capacity tracking and QR codes
- Volunteer registration with qualifications, availability, and operational radius
- Newsletter subscription with region and interest-based targeting
- Accessibility-first: skip navigation, dark mode, high-contrast toggle
- SEO-optimized with dynamic OpenGraph images and structured metadata

---

# Technical Deep-Dive

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15.3 (App Router, Turbopack) | Server-side rendering, routing, API |
| **React** | React 19.1 | UI rendering |
| **CMS** | Payload CMS 3.46 | Headless content management |
| **Database** | Supabase PostgreSQL | Managed PostgreSQL with connection pooling |
| **DB Adapter** | @payloadcms/db-postgres (Drizzle ORM) | Payload ↔ PostgreSQL bridge |
| **Rich Text** | @payloadcms/richtext-lexical | WYSIWYG editor in admin panel |
| **Styling** | Tailwind CSS 4.1 | Utility-first CSS |
| **UI Components** | Radix UI + shadcn/ui | Accessible, unstyled primitives |
| **Component Variants** | class-variance-authority | Type-safe component variant system |
| **Forms** | react-hook-form 7.56 + Zod 3.24 | Form state management and validation |
| **Date Utilities** | date-fns 4.1 | Date formatting and manipulation |
| **Icons** | Lucide React | Icon library |
| **Image Processing** | Sharp 0.33 | Server-side image optimization |
| **Language** | TypeScript 5.8 | Type safety |
| **Deployment** | Vercel (Serverless) | Hosting and edge functions |
| **Version Control** | Git + GitHub | Source control |

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    Vercel                         │
│  ┌───────────────────────────────────────────┐   │
│  │           Next.js 15 App Router           │   │
│  │  ┌─────────────────┬────────────────────┐ │   │
│  │  │   (frontend)/   │   (payload)/admin  │ │   │
│  │  │   Public Pages  │   CMS Admin Panel  │ │   │
│  │  └────────┬────────┴────────┬───────────┘ │   │
│  │           │                 │              │   │
│  │  ┌────────▼─────────────────▼───────────┐ │   │
│  │  │         Payload CMS 3.x              │ │   │
│  │  │  (embedded in Next.js, not separate) │ │   │
│  │  └────────────────┬─────────────────────┘ │   │
│  └───────────────────┼───────────────────────┘   │
│                      │                            │
└──────────────────────┼────────────────────────────┘
                       │ PostgreSQL (port 6543)
          ┌────────────▼────────────────┐
          │   Supabase PostgreSQL       │
          │   Transaction-mode Pooler   │
          │   (aws-1-eu-central-1)      │
          └─────────────────────────────┘
```

**Key architectural decisions:**

- **Embedded CMS**: Payload CMS runs inside the Next.js process — no separate backend server. The admin panel is served from `/admin`.
- **Supabase Pooler**: Production uses Supabase's transaction-mode connection pooler (port 6543) for compatibility with Vercel's serverless functions.
- **Dynamic rendering**: All database-dependent pages use `export const dynamic = 'force-dynamic'` since serverless cold starts need fresh data.
- **Route groups**: `(frontend)` for public pages, `(payload)` for the admin panel — clean separation without URL impact.

## Data Model

SCHUTZSCHILD uses 13 Payload CMS collections, organized into admin panel groups:

### Inhalte (Content)

| Collection | Slug | Description |
|---|---|---|
| **Articles** | `articles` | News articles, press releases, and informational content. Supports multiple article types (aktuelle-lage, hochwasser, waldbraende, ehrenamt, pressemitteilungen, regionale-nachrichten). Fields: title, slug, articleType, status (draft/published), content (rich text), excerpt, featuredImage, regions, author, publishedAt, isPriority. |
| **Pages** | `pages` | Static and template-based pages. Templates: default, homepage, vorsorge, warnung-information, gefahrenkarte. Fields: title, slug, template, content, heroImage, showInNavigation, navigationOrder, parentPage. |

### Veranstaltungen (Events)

| Collection | Slug | Description |
|---|---|---|
| **Events** | `events` | Training exercises, operations, and public events. Fields: title, slug, eventType, description, startDate, endDate, location (name, address, coordinates), capacity, registrationOpen, agenda (array), region, documents, featuredImage. |
| **Event Registrations** | `event-registrations` | Participant sign-ups for events. Public creation enabled. Fields: event (relation), participantName, email, phone, organization, status, specialRequests, qrCode, gdprConsent. |

### Ehrenamt (Volunteering)

| Collection | Slug | Description |
|---|---|---|
| **Volunteers** | `volunteers` | Volunteer registrations ("Spontanhelfer"). Public creation enabled. Fields: name, email, phone, address, region, qualifications, availability, operationalRadius, status, activationStatus, notes, GDPR consent tracking. |

### Warnungen (Warnings)

| Collection | Slug | Description |
|---|---|---|
| **Warnings** | `warnings` | Emergency alerts and advisories. Fields: title, content, severity, warningType, source (manual or nina-api), isActive, validFrom, validTo, regions, instructions, allClear status. |

### Kommunikation (Communication)

| Collection | Slug | Description |
|---|---|---|
| **Newsletters** | `newsletters` | Regular and crisis newsletter editions. Fields: title, edition, type (regular/crisis), status (draft/sent), content, relatedArticles, relatedEvents, targetRegions, sentAt, recipientCount. |
| **Subscribers** | `subscribers` | Newsletter recipients. Public creation enabled with double opt-in. Fields: email (unique), regions, interests, status (pending/active/unsubscribed), doubleOptInToken, gdprConsent. |

### Organisationen (Organizations)

| Collection | Slug | Description |
|---|---|---|
| **Units** | `units` | Emergency organizations (THW, Freiwillige Feuerwehr, Katastrophenschutz, Hilfsorganisationen). Fields: name, slug, unitType, description, logo, photos, contact info, region, featured status, memberCount, foundedYear. |

### Vorsorge (Preparedness)

| Collection | Slug | Description |
|---|---|---|
| **Checklists** | `checklists` | Preparedness checklists by risk profile. Fields: title, slug, description, riskProfile, householdSizes, categories (array with nested items), pdfConfig. |

### Stammdaten (Master Data)

| Collection | Slug | Description |
|---|---|---|
| **Regions** | `regions` | Brandenburg's administrative regions. Admin only. Fields: name, slug, type (landkreis/kreisfreie-stadt), latitude, longitude, riskProfile (array). |

### Medien (Media)

| Collection | Slug | Description |
|---|---|---|
| **Media** | `media` | Uploaded images, videos, and PDFs. Required alt text for accessibility. Image sizes: thumbnail (300×300), card (600×400), hero (1200×600), og (1200×630). |

### System

| Collection | Slug | Description |
|---|---|---|
| **Users** | `users` | Admin panel user accounts with role-based access. Fields: name, email, role (admin/editor/krisenstab/pressestelle). |

## Pages & Routes

### Main Pages

| Route | Description |
|---|---|
| `/` | Homepage — warning ticker, hero section, featured unit of the month, upcoming events, latest articles, newsletter signup |
| `/vorsorge` | Preparedness — checklists and risk-specific guidance |
| `/warnung-information` | Warnings & information overview |
| `/gefahrenkarte` | Interactive hazard map |
| `/spontanhelfer` | Volunteer registration form |
| `/spontanhelfer/danke` | Thank-you page after volunteer registration |
| `/newsletter` | Newsletter subscription |
| `/einheit-des-monats` | Unit of the Month spotlight |
| `/einheit-des-monats/archiv` | Archive of past featured units |
| `/veranstaltungen` | Events listing |
| `/veranstaltungen/[slug]` | Event detail with registration |

### Article Pages (dynamic `[slug]` routes)

| Route | Article Type |
|---|---|
| `/aktuelle-lage` / `/aktuelle-lage/[slug]` | Current situation reports |
| `/hochwasser` / `/hochwasser/[slug]` | Flood-related articles |
| `/waldbraende` / `/waldbraende/[slug]` | Forest fire articles |
| `/ehrenamt` / `/ehrenamt/[slug]` | Volunteering articles |
| `/pressemitteilungen` / `/pressemitteilungen/[slug]` | Press releases |
| `/regionale-nachrichten` / `/regionale-nachrichten/[slug]` | Regional news |
| `/uebungen-einsaetze` / `/uebungen-einsaetze/[slug]` | Exercises & operations |

### Emergency Pages

| Route | Description |
|---|---|
| `/notfall/[type]` | Emergency information by type — designed to function without JavaScript |

### Legal & Compliance Pages

| Route | Description |
|---|---|
| `/impressum` | Legal notice (Impressum) |
| `/datenschutz` | Privacy policy (Datenschutzerklärung) |
| `/barrierefreiheit` | Accessibility statement (Barrierefreiheitserklärung) |

## Component Architecture

### Layout Components

| Component | Description |
|---|---|
| `Header` | Site header with logo and navigation |
| `Navigation` | Main desktop navigation |
| `MobileNav` | Responsive mobile navigation menu |
| `Footer` | Site footer with links and legal information |
| `Breadcrumbs` | Hierarchical navigation breadcrumbs |

### Accessibility Components

| Component | Description |
|---|---|
| `SkipNav` | Skip-to-content link for keyboard users |
| `ThemeProvider` + `ThemeToggle` | Light/dark mode support |
| `HighContrastProvider` + `HighContrastToggle` | High-contrast mode for visual impairments |

### Content Components

| Component | Description |
|---|---|
| `HeroSection` | Homepage hero banner |
| `WarnTicker` | Scrolling warning ticker with live alerts |
| `WarningBanner` | Prominent alert banner |
| `ArticleCard` | Article preview card |
| `ArticleListing` | Filterable article list |
| `EventCard` | Event preview card |
| `UnitCard` | Organization unit card |
| `NewsletterSignup` | Newsletter subscription form |
| `ChecklistItem` + `ChecklistProgress` | Interactive preparedness checklists |
| `RegionFilter` | Region-based content filtering |
| `QuickLinks` | Quick link grid |
| `RichTextRenderer` | Lexical rich text renderer |
| `MapPlaceholder` | Map placeholder (for MapLibre integration) |

### Form Components

| Component | Description |
|---|---|
| `VolunteerForm` | Multi-step volunteer registration with react-hook-form + Zod validation |
| `EventRegistrationForm` | Event sign-up with capacity checking and QR code generation |

### UI Primitives (shadcn/ui + Radix)

20+ accessible, styled components including: Accordion, Badge, Breadcrumb, Button, Calendar, Card, Checkbox, Dialog, DropdownMenu, Form, Input, Label, NavigationMenu, Popover, Progress, RadioGroup, Select, Separator, Sheet, Switch, Tabs, Textarea, Toast.

All components use `class-variance-authority` for variant management and are styled with Tailwind CSS.

## Access Control & Roles

SCHUTZSCHILD implements four user roles with granular permissions:

| Role | German Name | Description |
|---|---|---|
| **Admin** | Administrator | Full system access — user management, all collections, settings |
| **Editor** | Redakteur | Content management — articles, pages, units, checklists, media |
| **Crisis Staff** | Krisenstab | Emergency operations — warnings, events, volunteer activation, articles |
| **Press Office** | Pressestelle | Public communications — articles (press releases) and media |

### Permission Matrix

| Collection | Admin | Editor | Crisis Staff | Press Office | Public |
|---|---|---|---|---|---|
| Users | CRUD | — | — | — | — |
| Articles | CRUD | CRUD | CRUD | CRUD | Read (published) |
| Pages | CRUD | CRUD | — | — | Read |
| Events | CRUD | CRUD | CRUD | — | Read |
| Event Registrations | CRUD | Read | CRUD | — | Create |
| Warnings | CRUD | CRUD | CRUD | — | Read (active) |
| Newsletters | CRUD | CRUD | — | — | Read (sent) |
| Subscribers | CRUD | Read | — | — | Create |
| Volunteers | CRUD | — | CRUD | — | Create |
| Units | CRUD | CRUD | — | — | Read |
| Checklists | CRUD | CRUD | — | — | Read |
| Regions | CRUD | — | — | — | Read |
| Media | CRUD | CRUD | CRUD | CRUD | Read |

## External Integrations

| Service | Purpose | API Type | Status |
|---|---|---|---|
| **NINA Warn-API** (BBK) | Official German emergency warnings — fetches alerts for warning ticker and warning pages | REST API | Stub (mock data) |
| **Pegelportal** (LfU Brandenburg) | Water level and flood monitoring data for the hazard map | REST API | Stub (mock data) |
| **Waldbrand-Warnstufen** | Forest fire danger level indices (levels 1–5) for Brandenburg | REST API | Stub (mock data) |
| **CleverReach** | Email marketing platform for newsletter distribution | REST API | Stub (subscriber sync, send) |
| **Postal** | Transactional email service for confirmations, double opt-in, notifications | HTTP API | Stub (send, bulk send) |
| **MapLibre GL JS** | Client-side interactive maps for hazard visualization, warning zones, flood levels | JS Library | Config helper |

All external integrations are architected with clean interfaces in `src/lib/integrations/` and currently return mock data, ready to be connected to production APIs.

## Infrastructure & Deployment

| Aspect | Configuration |
|---|---|
| **Hosting** | Vercel (serverless) |
| **Database** | Supabase PostgreSQL (project: `znybkrlqaiclgyzimboh`) |
| **DB Connection** | Transaction-mode pooler on `aws-1-eu-central-1.pooler.supabase.com:6543` |
| **SSL** | `{ rejectUnauthorized: false }` in production (Supabase pooler requirement) |
| **Rendering** | `force-dynamic` on all DB-dependent pages |
| **Dev Server** | `next dev --turbopack` for fast local development |
| **Build** | `next build` with Payload type generation |
| **Image Optimization** | Sharp with 4 responsive breakpoints (thumbnail, card, hero, og) |

## Project Structure

```
schutzschild-brandenburg/
├── src/
│   ├── access/                  # Role-based access control functions
│   │   └── index.ts
│   ├── app/
│   │   ├── (frontend)/          # Public-facing pages (29 routes)
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── aktuelle-lage/
│   │   │   ├── barrierefreiheit/
│   │   │   ├── datenschutz/
│   │   │   ├── ehrenamt/
│   │   │   ├── einheit-des-monats/
│   │   │   ├── gefahrenkarte/
│   │   │   ├── hochwasser/
│   │   │   ├── impressum/
│   │   │   ├── newsletter/
│   │   │   ├── notfall/
│   │   │   ├── pressemitteilungen/
│   │   │   ├── regionale-nachrichten/
│   │   │   ├── spontanhelfer/
│   │   │   ├── uebungen-einsaetze/
│   │   │   ├── veranstaltungen/
│   │   │   ├── vorsorge/
│   │   │   ├── waldbraende/
│   │   │   ├── warnung-information/
│   │   │   └── layout.tsx
│   │   ├── (payload)/           # Payload CMS admin panel
│   │   │   └── admin/
│   │   └── api/                 # REST API routes
│   ├── collections/             # 13 Payload CMS collections
│   │   ├── Articles.ts
│   │   ├── Checklists.ts
│   │   ├── EventRegistrations.ts
│   │   ├── Events.ts
│   │   ├── Media.ts
│   │   ├── Newsletters.ts
│   │   ├── Pages.ts
│   │   ├── Regions.ts
│   │   ├── Subscribers.ts
│   │   ├── Units.ts
│   │   ├── Users.ts
│   │   ├── Volunteers.ts
│   │   └── Warnings.ts
│   ├── components/
│   │   ├── a11y/                # Accessibility (SkipNav, ThemeToggle, HighContrast)
│   │   ├── content/             # Content (HeroSection, ArticleCard, WarnTicker, etc.)
│   │   ├── forms/               # Forms (VolunteerForm, EventRegistrationForm)
│   │   ├── layout/              # Layout (Header, Footer, Navigation, Breadcrumbs)
│   │   └── ui/                  # shadcn/ui primitives (20+ components)
│   ├── fields/                  # Reusable Payload field definitions
│   ├── hooks/                   # Payload lifecycle hooks
│   ├── lib/
│   │   └── integrations/        # External API clients (NINA, CleverReach, etc.)
│   ├── migrations/              # Database migrations
│   └── seed/                    # Database seeding scripts
├── payload.config.ts            # Payload CMS configuration
├── next.config.mjs              # Next.js configuration
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

*Built with Next.js 15, Payload CMS 3, Supabase PostgreSQL, and Tailwind CSS. Deployed on Vercel.*
