# Mietservice24 — Project Overview

## 1. Executive Summary

Mietservice24 is a full-stack web platform built for **Lück Mietservice 24**, a regional equipment rental business operating out of Fichtenwalde and Rathenow in Brandenburg, Germany. The platform replaces an entirely manual, phone-and-WhatsApp-based booking workflow with a modern self-service system: customers browse available equipment, check real-time availability on an interactive calendar, submit booking requests, and receive automated email confirmations — while the business owner manages everything through one-click action links in structured email notifications. Built with Next.js 14, Supabase, and Resend, the project delivers 24/7 online booking, zero manual data entry, and a professional branded presence — transforming a traditional trade business into a digitally-enabled operation.

---

## 2. The Problem

Lück Mietservice 24 rents heavy equipment — trucks with cranes, lifting platforms, trench cutters, and wood chippers — to construction firms, landscapers, and private customers across Brandenburg. Before this platform, every aspect of the business ran on manual processes:

- **No online presence** — Customers had no way to see what equipment was available or when. The only option was to call during business hours or send a WhatsApp message.
- **Phone-based booking** — Every booking started with a phone call. The admin (Monty Lück) would take details verbally, check a paper or spreadsheet calendar, and manually confirm back.
- **No self-service** — Customers could not check availability, compare services, or submit requests outside of Mon–Fri 07:00–18:00 / Sat 08:00–16:00.
- **Manual confirmations** — Every booking confirmation, cancellation, and follow-up was written and sent by hand — via phone, WhatsApp, or email.
- **No structured records** — Booking history lived in spreadsheets, notebooks, or message threads with no searchable audit trail.
- **No legal compliance infrastructure** — No GDPR privacy policy, no formal terms and conditions, no digital Impressum — all legally required for a German business with an online presence.
- **Double-booking risk** — Without a shared, real-time calendar, there was no automated way to prevent scheduling conflicts.

---

## 3. Manual Tasks Eliminated

| Manual Workflow | Before | After |
|---|---|---|
| **Inquiry handling** | Customer calls or emails → admin manually notes details → manually replies with availability | Customer fills contact form → auto-email sent to admin with structured details → auto-confirmation sent to customer — all in seconds |
| **Booking management** | Phone call → admin checks paper/spreadsheet → manually confirms by phone/WhatsApp | Customer self-serves: selects dates on calendar → fills form → booking stored in Supabase → admin receives email with one-click Confirm/Cancel buttons |
| **Availability checking** | Customer calls during business hours, admin looks up paper records | Real-time interactive calendar shows confirmed bookings, visually blocks booked dates, prevents double-booking |
| **Customer confirmation emails** | Admin manually writes and sends each confirmation | Automated branded HTML emails at every stage: inquiry received, booking received, booking confirmed, booking cancelled |
| **Admin notifications** | Admin checks voicemail, email inbox, or WhatsApp throughout the day | Instant structured email with all booking/inquiry details + one-click action buttons arrive the moment a request is submitted |
| **Record keeping** | Paper notebooks, spreadsheets, WhatsApp message history | Supabase PostgreSQL database with indexed tables, full audit trail, timestamps, and status tracking |
| **Legal compliance** | No digital legal pages | Built-in Impressum, Datenschutzerklärung (GDPR), and AGB pages with complete German legal text |

---

## 4. The Solution — Architecture Overview

The platform follows a straightforward three-tier architecture:

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  Next.js 14 App Router (React 18 + TypeScript)          │
│  Pages: Landing · Service Detail · Legal · Admin Status │
│  Components: Calendar · BookingForm · Contact · Header  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────────┐
│                    API ROUTES                            │
│  /api/bookings      — GET (availability) · POST (new)   │
│  /api/contact       — POST (inquiry)                    │
│  /api/admin/confirm/[token] — GET (confirm booking)     │
│  /api/admin/cancel/[token]  — GET (cancel booking)      │
└──────┬──────────────────────────────────┬───────────────┘
       │                                  │
┌──────▼──────────┐            ┌──────────▼──────────────┐
│    SUPABASE     │            │        RESEND           │
│   (PostgreSQL)  │            │   (Transactional Email)  │
│                 │            │                          │
│  bookings table │            │  6 branded HTML templates│
│  RLS policies   │            │  Admin + Customer emails │
│  Indexes        │            │  Color-coded by type     │
└─────────────────┘            └──────────────────────────┘
```

**Deployment:** Vercel (automatic deployments from GitHub, serverless API routes)
**Repository:** GitHub — Simplefysed/mietservice24

---

## 5. Tech Stack

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 14.2.31 | Framework — App Router, SSR, API routes, file-based routing |
| **TypeScript** | 5.3.3 | Language — strict mode, type safety across frontend and backend |
| **React** | 18.2.0 | UI library — component-based interface |
| **Tailwind CSS** | 3.3.6 | Styling — utility-first CSS with custom brand color palette |
| **Lucide React** | 0.294.0 | Icons — consistent, lightweight icon system |
| **Supabase** (`@supabase/supabase-js`) | 2.55.0 | Database — PostgreSQL, row-level security, indexed queries |
| **Resend** | 6.9.2 | Email — transactional emails with branded HTML templates |
| **UUID** | 11.1.0 | Token generation — secure one-click admin action links |
| **ESLint** | 8.56.0 | Linting — code quality enforcement |
| **PostCSS + Autoprefixer** | 8.4.32 / 10.4.16 | CSS processing — vendor prefixing |
| **Vercel** | — | Hosting — automatic GitHub deployments, serverless functions |

---

## 6. Features Deep-Dive

### Homepage (`/`)
- **Hero section** with business tagline and call-to-action buttons
- **Services overview** — grid of 4 equipment categories with icons, descriptions, and links to detail pages
- **About section** — company stats (4+ years experience, 100% maintained equipment)
- **Contact form** — general inquiry form with service selector, location, date range, and message fields
- **SEO metadata** — German-language title, description, and keywords for search visibility
- **Smooth scrolling** — anchor links to each section (`#services`, `#about`, `#contact`)

### Service Detail Pages (`/services/[slug]`)
- **Dynamic routing** for each equipment type (4 slugs)
- **Interactive calendar** — date range picker with real-time availability from Supabase
- **Visual booking indicators** — booked dates shown in red with strikethrough, selected range highlighted
- **German-localized** date display (month names, day abbreviations)
- **Booking form** — appears after date selection with customer details and time pickers

### Booking System
- **Calendar-driven** — customers pick start/end dates visually
- **Real-time availability** — confirmed bookings fetched from Supabase on calendar load
- **Date range selection** — click start date, click end date, range highlighted
- **Form validation** — all required fields enforced before submission
- **Supabase persistence** — bookings stored with full schema (service, customer, dates, times, status)
- **UUID-based admin tokens** — each booking gets a unique token for secure confirm/cancel URLs
- **Booking lifecycle** — `pending` → `confirmed` or `cancelled`
- **Default times** — 08:00–17:00 pre-filled, adjustable by customer

### Email Notification System
Six branded HTML email templates with color-coded headers (see Section 8 for full details). Every booking and inquiry triggers appropriate emails to both admin and customer automatically.

### Admin Workflow
- **Email-based** — no separate admin dashboard needed
- **One-click actions** — Confirm and Cancel buttons in admin notification emails
- **Token-secured URLs** — `/api/admin/confirm/[token]` and `/api/admin/cancel/[token]`
- **Feedback pages** — `/admin/success` and `/admin/error` pages show action results
- **Cascading emails** — confirming or cancelling a booking automatically notifies the customer

### Contact System
- **General inquiry form** with fields: name, email, phone, location (Einsatzort), service selector, date range, message
- **Service options** — Häcksler, Hebebühne, Fräse, LKW mit Ladekran, Kleinbus (9 Sitzer), Sonstiges
- **Dual email routing** — admin gets structured inquiry, customer gets confirmation
- **Contact info displayed** — phone, email, address, business hours, contact person (Monty Lück)
- **Response guarantee** — answer within 2 hours (business hours), binding offer within 24 hours

### Legal Compliance
- **Impressum** (`/impressum`) — full business registration, VAT ID (DE213717320), supervisory authority, liability disclaimers
- **Datenschutz** (`/datenschutz`) — GDPR-compliant privacy policy covering data collection, processing basis, storage duration, data subject rights
- **AGB** (`/agb`) — rental terms and conditions: contract formation, minimum rental periods, payment terms, cancellation policy, liability, deposit requirements. Effective January 2025.

### Responsive Design
- **Mobile-first** approach with Tailwind breakpoints (sm/md/lg/xl)
- **Hamburger menu** for mobile navigation
- **Adaptive grids** — service cards, contact layout, and forms reflow for small screens
- **Touch-friendly** calendar interaction

---

## 7. Data Model

### `bookings` Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, auto-generated | Unique booking identifier |
| `service_id` | TEXT | NOT NULL | Equipment slug (e.g. `hebebuehnen`) |
| `customer_name` | TEXT | NOT NULL | Customer full name |
| `customer_email` | TEXT | NOT NULL | Customer email address |
| `customer_phone` | TEXT | NOT NULL | Customer phone number |
| `start_date` | DATE | NOT NULL | Rental start date |
| `end_date` | DATE | NOT NULL | Rental end date |
| `start_time` | TIME | NOT NULL | Pickup time |
| `end_time` | TIME | NOT NULL | Return time |
| `status` | TEXT | DEFAULT `'pending'`, CHECK IN (`pending`, `confirmed`, `cancelled`) | Booking lifecycle state |
| `booking_token` | TEXT | UNIQUE, NOT NULL | UUID token for admin action URLs |
| `created_at` | TIMESTAMPTZ | DEFAULT `NOW()` | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT `NOW()` | Last modification timestamp |

### Indexes
- `idx_bookings_service_date` — on (`service_id`, `start_date`, `end_date`) for availability queries
- `idx_bookings_token` — on (`booking_token`) for fast admin action lookups
- `idx_bookings_status` — on (`status`) for filtering by lifecycle state

### Row-Level Security (RLS) Policies
- **Public read** — anyone can read confirmed bookings (powers the calendar availability display)
- **Public insert** — anyone can create new bookings (from the booking form)
- **Admin update** — only the Supabase Service Role can update booking status (used by API routes)

### Booking Lifecycle
```
Customer submits form
        │
        ▼
   ┌─────────┐
   │ PENDING  │ ← Initial state
   └────┬─────┘
        │
   Admin clicks
   email button
        │
   ┌────┴─────┐
   │          │
   ▼          ▼
┌──────────┐ ┌──────────┐
│CONFIRMED │ │CANCELLED │
└──────────┘ └──────────┘
```

---

## 8. Email System

All emails are sent via **Resend** from `Mietservice24 <info@simplefysed.com>`. Each template uses branded HTML with a color-coded header bar.

| # | Email Type | Trigger | Recipient | Subject Pattern | Header Color |
|---|---|---|---|---|---|
| 1 | **Contact Inquiry → Admin** | Customer submits contact form | info@mietservice24.com | `Neue Kontaktanfrage von [Name]` | `#1e40af` (blue) |
| 2 | **Contact Received → Customer** | Customer submits contact form | Customer email | `Ihre Anfrage wurde empfangen: [Service]` | `#4a8a7a` (brand green) |
| 3 | **New Booking → Admin** | Customer submits booking | info@mietservice24.com | `Neue Buchungsanfrage: [Service] – [Name]` | `#1e40af` (blue) |
| 4 | **Booking Received → Customer** | Customer submits booking | Customer email | `Ihre Anfrage wurde empfangen: [Service]` | `#4a8a7a` (brand green) |
| 5 | **Booking Confirmed → Customer** | Admin clicks Confirm | Customer email | `Buchung bestätigt: [Service]` | `#16a34a` (green) |
| 6 | **Booking Cancelled → Customer** | Admin clicks Cancel | Customer email | `Buchung storniert: [Service]` | `#dc2626` (red) |

**Service name mapping** (slug → display name in emails):

| Slug | Display Name |
|---|---|
| `lkw-mit-kran-und-kipper` | LKW mit Kran und Kipper |
| `hebebuehnen` | Hebebühnen |
| `grabenfraesen` | Grabenfräsen |
| `haecksler` | Häcksler |
| `hebebuehne` | Hebebühne |
| `fraese` | Fräse |
| `lkw-kran` | LKW mit Ladekran |
| `kleinbus` | Kleinbus (9 Sitzer) |
| `sonstiges` | Sonstiges |

---

## 9. Results & Outcomes

| Outcome | Impact |
|---|---|
| **24/7 online booking** | Customers can browse and book anytime — not limited to business hours phone calls |
| **Instant customer feedback** | Automated confirmation emails arrive in seconds instead of hours or days |
| **Zero manual data entry** | Every booking is captured directly into the database from the customer's own input |
| **Real-time availability** | Interactive calendar prevents double-booking by showing confirmed reservations |
| **Professional branded communication** | Color-coded HTML email templates replace informal WhatsApp messages |
| **One-click admin actions** | Confirm or cancel a booking with a single click from an email — no login required |
| **Full audit trail** | Every booking is timestamped and tracked in PostgreSQL with status history |
| **Legal compliance** | GDPR privacy policy, Impressum, and AGB built into the site from day one |
| **Mobile-friendly** | Responsive design serves customers on phones and tablets — critical for tradespeople in the field |
| **Scalable foundation** | Adding new equipment types requires only a new entry in the services array — no structural changes |

---

## 10. Project Structure

```
Mietservice24/
├── app/
│   ├── api/
│   │   ├── bookings/route.ts          # GET availability, POST new booking
│   │   ├── contact/route.ts           # POST contact inquiry
│   │   └── admin/
│   │       ├── confirm/[token]/route.ts  # Confirm booking via token
│   │       └── cancel/[token]/route.ts   # Cancel booking via token
│   ├── services/[slug]/page.tsx        # Dynamic service detail + booking
│   ├── admin/
│   │   ├── success/page.tsx            # Action success feedback
│   │   └── error/page.tsx              # Action error feedback
│   ├── impressum/page.tsx              # Legal notice
│   ├── datenschutz/page.tsx            # Privacy policy (GDPR)
│   ├── agb/page.tsx                    # Terms & conditions
│   ├── layout.tsx                      # Root layout + metadata
│   ├── page.tsx                        # Landing page
│   └── globals.css                     # Tailwind base + custom classes
├── components/
│   ├── Header.tsx                      # Navigation bar + mobile menu
│   ├── Hero.tsx                        # Hero section
│   ├── Services.tsx                    # Equipment grid
│   ├── About.tsx                       # About section with stats
│   ├── Contact.tsx                     # Contact form + info
│   ├── Footer.tsx                      # Site footer
│   ├── Calendar.tsx                    # Interactive date range picker
│   └── BookingForm.tsx                 # Booking submission form
├── lib/
│   ├── services.ts                     # Service definitions (slugs, features, limits)
│   ├── supabase.ts                     # Supabase client + TypeScript types
│   └── email.ts                        # 6 email templates (Resend)
├── package.json
├── tailwind.config.js                  # Custom brand colors
├── tsconfig.json                       # Strict TypeScript config
├── next.config.js
└── postcss.config.js
```

---

*Built by [Simplefysed](https://simplefysed.com) for Lück Mietservice 24.*
