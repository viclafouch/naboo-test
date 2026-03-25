# Architecture

## Overview

Naboo Places is a place discovery platform where users search, browse paginated results, and view individual place pages. Built as a **Turborepo monorepo** with Next.js 16 App Router, a shared design system (shadcn/ui + Base UI), React 19, Tailwind CSS v4, and nuqs for type-safe URL state management.

The focus is on strong architecture decisions, rendering strategy, Core Web Vitals, accessibility, and code organization — not feature completeness.

## Code Organization

```
apps/web/
  app/                    Routes (Next.js App Router) + colocated _components/
  constants/              Domain constants (one file per domain)
  helpers/                Pure generic functions (formatting, no domain deps)
  lib/                    Data access layer + domain-specific formatters
  types/                  Shared TypeScript types
  data/                   Mock data (JSON + async loader)
  e2e/                    Playwright E2E tests

packages/design-system/   Shared UI components (shadcn/ui base-nova + CVA)
packages/eslint-config/   Shared ESLint configs (base, react, next, playwright)
packages/typescript-config/ Shared TypeScript configs (base, nextjs, react-library)
```

**Key conventions:**
- Page-specific components live in `_components/` next to the route, not in a global folder
- `helpers/` contains only pure, generic functions with no domain type dependencies
- `lib/` houses data access functions and domain-specific formatters that depend on domain types
- No barrel files — direct imports only
- The design system is the only shared component library — no `components/` in the app

## Architecture Decisions

### SSR Streaming for `/search`

The search page uses **server-side rendering with streaming** via React Suspense. The search bar renders immediately while results stream in asynchronously. The user sees the interactive search bar instantly, with skeleton cards shown until data arrives.

The Suspense boundary uses a composite `key` (`query-category-page`) to force re-mounting on any parameter change, ensuring the fallback skeleton is shown for every new search. This trade-off prioritizes clear loading feedback over keeping stale content visible.

**Why not client-side fetching?** Client-side `useEffect` + `fetch` would ship the data fetching logic to the browser, add a waterfall (JS download → hydration → fetch → render), and hurt SEO since results wouldn't be in the initial HTML. SSR streaming gives fast interactive shell + server-rendered content.

### SSG for `/places/[slug]`

Place detail pages are **statically generated** at build time using `generateStaticParams`. All 30 place pages are pre-rendered as HTML. `generateMetadata` produces dynamic SEO metadata and OpenGraph tags for each place. Unknown slugs return `notFound()`.

**Why not SSR?** The data is static (mock data). There is no reason to re-compute the page on every request. SSG gives optimal performance with zero runtime cost. If the data source became dynamic, switching to ISR (`revalidate`) would be trivial.

### Direct Server Functions (No Route Handlers)

Server Components call TypeScript functions directly (`searchPlaces()`, `getPlaceBySlug()`) without an HTTP hop. In a real application with a backend, these functions would be replaced with `fetch()` calls to an API.

**Why not Route Handlers?** Route Handlers add an unnecessary HTTP roundtrip in SSR. The Server Component already runs on the server — calling a function directly is simpler, faster, and type-safe. This is a deliberate architectural choice that eliminates boilerplate while being easy to evolve toward a real API.

### nuqs for URL State Management

Search state (query, category, page) is managed through URL search parameters using [nuqs](https://nuqs.dev). The URL is the source of truth — users can share, bookmark, and refresh the page without losing search context. The search input uses local `useState` for controlled input behavior, synced to the URL on form submission.

**Why not `useState` + `useRouter`?** Manual URL manipulation is error-prone, requires imperative `router.push` calls, and doesn't provide type-safe parsing. nuqs offers declarative URL state with `parseAsString`, `parseAsInteger`, `parseAsStringEnum`, batched updates, `startTransition` integration, and a server-side `createSearchParamsCache` for consistent parsing between server and client components.

### shadcn/ui in a Shared Design System

UI components live in `packages/design-system`, consumed by the app via `transpilePackages` in `next.config.ts`. Components are added via the shadcn CLI, which generates source code that we own and can customize. The design system uses the `base-nova` style (Base UI primitives) with CVA for variants and exports 7 components (Button, Input, Select, Card, Badge, Skeleton, Pagination).

Tailwind CSS scans the design system source via `@source` in `globals.css`, ensuring all utility classes used by design system components are included in the app's CSS bundle.

**Why not build from scratch?** shadcn provides production-grade, accessible components out of the box. By generating source code rather than importing a library, we retain full control over styling and behavior while avoiding reinventing accessibility patterns (focus management, ARIA, keyboard navigation).

### Error Handling

The search page has a dedicated `error.tsx` error boundary (Next.js convention) that catches errors from the async `searchPlaces()` function and displays a user-friendly message with a "Try again" button calling `reset()`. The data layer includes a configurable `SEARCH_FAILURE_RATE` constant (disabled by default) to simulate backend failures during development.

## Rendering Strategy

| Route | Strategy | Why |
|-------|----------|-----|
| `/` | Static | Simple landing page, no dynamic data |
| `/search` | SSR Streaming | Dynamic search params, Suspense for perceived perf |
| `/places/[slug]` | SSG | Static mock data, 30 pages pre-rendered at build |

## Data Fetching & Caching

- **Mock data** stored as JSON, loaded via dynamic `import()` to simulate async API behavior
- **`searchPlaces()`** adds a random 0-600ms delay (concurrent with data loading via `Promise.all`) to simulate network latency, enabling realistic streaming/skeleton testing
- **`getPlaceBySlug()`** wrapped in `React.cache()` for request-level deduplication (called by both `generateMetadata` and the page component)
- **No HTTP caching** — with mock data in memory, there is nothing to cache. With a real API, we would use `fetch()` with `next.revalidate` for ISR caching

## URL State Management

```
/search?q=paris&category=villa&page=2
```

- **Parsers** defined once in `search-params.ts`, shared between server (`createSearchParamsCache`) and client (`useQueryStates`)
- **Type-safe**: `page` uses `parseAsInteger`, `category` uses `parseAsStringEnum` restricted to valid values
- **`shallow: false`** triggers server re-renders on URL changes — results stream via Suspense
- **`startTransition`** provides loading feedback (button shows "Searching…") during server re-renders

## Core Web Vitals

- **LCP**: SSR streaming for `/search` delivers HTML fast. `next/image` with `priority` on the first card image and the detail page hero image. Responsive `sizes` attributes prevent oversized image downloads.
- **CLS**: Skeleton cards match the exact dimensions of real cards (`aspect-4/3` + identical grid layout). `next/image` with explicit `width`/`height` prevents layout shift. `next/font` (Geist) with `font-display: swap` avoids FOIT.
- **INP**: Server Components minimize client-side JavaScript. Only the search bar and pagination are Client Components. All other UI (cards, detail page, skeletons) ships zero JS.

## Accessibility

- **Semantic HTML**: `<main>`, `<article>`, `<nav>`, `<h1>`/`<h2>` heading hierarchy
- **Skip-to-content**: Hidden link in the root layout, visible on focus, targets `#main-content`
- **ARIA**: `role="search"` on the search form, `aria-label` on all inputs and the pagination, `aria-live="polite"` region announcing result count to screen readers, `aria-busy` on the form during loading, `aria-current="page"` on the active pagination button, `aria-hidden` on decorative icons and emoji
- **Keyboard navigation**: All interactive elements are focusable with visible focus rings (`focus-visible:ring`)
- **Reduced motion**: `prefers-reduced-motion` media query disables skeleton pulse animations
- **Base UI primitives**: Select component provides native ARIA listbox semantics and keyboard support

## Testing & CI

### E2E Tests (Playwright)

8 tests across 6 spec files covering all 6 required user flows:

| Test | User Flow Covered |
|------|-------------------|
| Search and filtering | Search for places + filter by category |
| Pagination (navigate) | Navigate paginated results |
| Pagination (refresh) | Refresh URL preserves state |
| URL state sharing | Share URL keeps same results |
| Navigation (detail) | Open place detail page |
| Navigation (back) | Return to search |
| Empty state | No results feedback |
| Homepage | Entry point navigation |

### CI Pipeline (GitHub Actions)

Single sequential job: `pnpm install` → `pnpm lint` (TypeScript + ESLint) → `pnpm build` → Playwright install → `pnpm test:e2e`

## What Is NOT Implemented (and why)

- **No real backend** — the test focuses on frontend architecture, not API design
- **No sitemap/robots** — mock data, no real deployment
- **No authentication** — out of scope for a search/browse experience
- **No multi-image gallery** — single hero image is sufficient to demonstrate `next/image` optimization
- **No infinite scroll** — pagination is more accessible, SEO-friendly, and URL-driven
- **No i18n** — single-language app, though the architecture (constants for labels, helpers for formatting) supports extraction

## What I Would Improve With More Time

- **Advanced filters** — price range slider, sort by rating/price, multi-select categories
- **Map view** — integrated map alongside the list, with marker clustering
- **Favorites** — heart icon on cards, persisted in localStorage or a backend
- **i18n** — extract all strings, support French/English with next-intl
- **Unit tests** — test helpers, data functions, and design system components with Vitest
- **Image optimization** — blur placeholders via `plaiceholder`, responsive art direction
- **Error monitoring** — Sentry integration for production error tracking
- **Performance budget** — Lighthouse CI in the pipeline with score thresholds
