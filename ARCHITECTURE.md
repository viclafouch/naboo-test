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

### Partial Prerendering (PPR) for `/search`

When a user visits `/search`, the browser needs to display two things: the **page structure** (heading, search form) and the **search results** (the actual places). These two things have very different requirements:

- The page structure is always the same — it doesn't depend on what the user searched for
- The search results depend on the URL parameters (`?q=paris&category=villa&page=2`) and require a data fetch

**Partial Prerendering** splits the page into these two parts. At build time (`pnpm build`), Next.js generates the static HTML for the page structure — the heading, the search bar skeleton, the layout. This HTML is ready to be served instantly, before any server code runs.

When a real user visits the page, this is what happens:

1. The **static shell** (heading + skeleton placeholders) is served immediately from the CDN — no server computation needed
2. The server starts fetching data for the dynamic parts in parallel
3. The **SearchBar** (a client component that reads the URL) hydrates almost instantly — replacing its skeleton
4. The **search results** stream in once `searchPlaces()` resolves — replacing the card skeletons with real place cards

This is implemented using two **React Suspense boundaries** — one wrapping the SearchBar, one wrapping the SearchResults. Each Suspense boundary has a fallback (skeleton) shown until its content is ready. They are independent: results can arrive before or after the search bar hydrates.

**What happens on subsequent searches (user types a new query)?**

The SearchBar is a client component — it lives entirely in the browser after the first load. When the user submits a new search:

1. The SearchBar updates the URL (via nuqs) and shows "Searching..." on the button
2. Old results **stay visible** while new ones load (no skeleton flash)
3. New results seamlessly replace old results when the server response arrives

This "stale while loading" behavior is powered by React's `startTransition` — the same pattern Airbnb uses in production.

**Why not client-side fetching (`useEffect` + `fetch`)?** That approach would require: download JavaScript → parse → hydrate → make API call → render results. The user sees nothing until all of that completes. With PPR, they see the page structure instantly, then results stream in from the server — no client-side waterfall.

### Partial Prerendering for `/places/[slug]`

Place detail pages (e.g., `/places/cozy-apartment-paris`) use `generateStaticParams` to **list all known place slugs at build time**. Next.js generates a complete HTML page for each slug — 30 pages in our case.

The data function `getPlaceBySlug()` uses `"use cache"` (explained below in Data Fetching), which means:

- The first time someone visits a place page → the server fetches the data, renders the page, and **stores the result in a cache** for 1 day
- The next visitor for the same place within that day → the cached result is served **instantly**, without re-fetching

In production with millions of places, you wouldn't prerender all of them. You'd prerender the top 1000 most popular places (via `generateStaticParams`), and the rest would be rendered on first visit, then cached. This gives you the best of both worlds: instant pages for popular places, and fast-after-first-visit for the rest.

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
| `/` | Static | Simple landing page, no dynamic data — generated once at build time |
| `/search` | Partial Prerender | Shell prerendered at build, results streamed per request |
| `/places/[slug]` | Partial Prerender (SSG) | All pages prerendered at build, data cached for 1 day with on-demand invalidation |

## Data Fetching & Caching

### How caching works in Next.js 16

Next.js 16 introduces an **explicit, opt-in caching model**. Nothing is cached by default — you choose what to cache and for how long. This is enabled by `cacheComponents: true` in `next.config.ts`.

The mechanism is a directive called **`"use cache"`** that you place at the top of a function:

```ts
export const searchPlaces = async ({ query, category, page }) => {
  "use cache"            // ← "cache the return value of this function"
  cacheLife('minutes')   // ← "keep it fresh for ~1 minute, expire after 1 hour"
  cacheTag('places')     // ← "label it 'places' so I can invalidate it later"

  // ... fetch data from API
}
```

When this function is called:

1. **First call** with `{ query: "paris", page: 1 }` → the function runs normally (API call + delay), and the **result is stored in a server-side cache**. The cache key is automatically generated from the arguments.
2. **Second call** with the exact same arguments → the cached result is returned **instantly**, without running the function again. No API call, no delay.
3. **Call with different arguments** (e.g., `{ query: "rome", page: 1 }`) → cache miss, the function runs again for this new combination.
4. **After the cache expires** (defined by `cacheLife`) → the next call re-executes the function and stores the fresh result.

### Cache durations used in this project

Each data function has a cache duration adapted to how often its data changes in a real-world scenario:

| Function | Duration | Meaning | Real-world rationale |
|----------|----------|---------|---------------------|
| `searchPlaces()` | `'minutes'` | Revalidate every ~1 min, expire after 1h | Search results change frequently (new listings, price updates, availability changes) |
| `getPlaceBySlug()` | `'days'` | Revalidate every ~1 day, expire after 1 week | Individual place details (name, description, location) are relatively stable |
| `getAllSlugs()` | `'hours'` | Revalidate every ~1h, expire after 1 day | New places are added periodically but not every minute |

### Cache invalidation with tags

Each cached function is labeled with **tags** — string labels used to manually invalidate cache entries when data changes:

- **`cacheTag('places')`** on all three functions → calling `revalidateTag('places')` in a Server Action would invalidate **all** place-related caches at once. Useful after a bulk data import.
- **`cacheTag('place-${slug}')`** on `getPlaceBySlug()` → calling `revalidateTag('place-cozy-apartment-paris')` would invalidate only **that specific place page**. Useful after an admin edits a single listing.

This project doesn't implement the invalidation side (no Server Actions, no admin UI), but the tagging is in place — the data layer is **production-ready for on-demand revalidation**.

### Mock data simulation

- Data is stored as JSON, loaded via dynamic `import()` to simulate async API behavior
- `searchPlaces()` adds a random 0-600ms delay to simulate network latency — on cache hits, the response is instant (delay is skipped because the entire function is cached)
- If the function throws an error, the error is **not cached** — the next request retries normally

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
