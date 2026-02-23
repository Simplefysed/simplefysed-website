# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
claude --dangerously-skip-permissions
```

## Project Overview

Simplefysed Solutions marketing website built with Next.js 16, React 19, and TypeScript. Features interactive 3D graphics, a web-based terminal/CLI, and advanced animations with a neon cyberpunk aesthetic.

## Commands

All commands should be run from the `website/` directory:

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Directory Structure (`website/src/`)

- **app/** - Next.js App Router pages
  - `page.tsx` - Home page
  - `case-studies/` - Case studies listing and `[slug]` dynamic routes
  - `services/` and `opportunities/` pages

- **components/** - Organized by feature:
  - `hero/` - 3D hero section using Three.js (@react-three/fiber, drei, postprocessing)
  - `layout/` - Header, Navigation, MobileMenu, Footer
  - `sections/` - Page sections (ServicesShowcase, CaseStudyPreview, TechStack, CTASection)
  - `terminal/` - Interactive web CLI with xterm and custom command handlers
  - `ui/` - Reusable components (Button, Card with variants, GlowEffect, GradientText)

- **hooks/** - Custom React hooks (useMousePosition)
- **stores/** - Zustand stores (terminalStore.ts)
- **lib/** - Utilities (`cn` for classnames, `sleep`, `lerp`, `clamp`, `randomBetween`)
- **styles/** - Global CSS with design system variables

### Key Technologies

- **3D Graphics:** Three.js + @react-three/fiber + drei + postprocessing
- **Animation:** Framer Motion (primary), GSAP, Lenis (smooth scroll)
- **State:** Zustand for terminal state management
- **Styling:** Tailwind CSS 4 with CSS custom properties for design tokens
- **Icons:** Lucide React

### Design System

Colors are defined as CSS variables in `globals.css`:
- Backgrounds: `--bg-primary` (#0a0a0f), `--bg-secondary`, `--bg-tertiary`
- Neon accents: `--neon-cyan`, `--neon-purple`, `--neon-green`, `--neon-pink`
- Glow effects via box-shadow utilities

Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (monospace)

### Code Patterns

- Use `'use client'` directive for interactive components
- Path alias: `@/*` maps to `./src/*`
- Component variants use the `cn()` utility combining clsx + tailwind-merge
- Framer Motion `whileInView` for scroll animations, `whileHover`/`whileTap` for interactions
- Terminal commands support ANSI color codes and async streaming output

### Terminal Component

The web CLI in `components/terminal/` has commands defined in `commands/index.ts`:
- help, about, services, contact, clear
- `demo --ai` runs an animated demo sequence

Uses Zustand store for history and state, xterm for rendering.
