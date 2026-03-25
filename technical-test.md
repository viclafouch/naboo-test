# Senior Frontend engineer technical test

## Context

You are building the frontend foundation of a **place discovery platform** (similar to Airbnb, Booking, etc.).

Users can search for places, browse paginated results, and access a dedicated page for each place.

This test evaluates your ability to make strong frontend implementation and architecture decisions in a realistic product context.

---

## Expected Setup

Create a Typescript **monorepo using Turborepo** with at least:

- `apps/web` → Next.js application
- `packages/design-system` → shared React UI components
- A minimal CI, type-checking and happy-path e2e tests with Playwright

You may add other packages if needed, you are free to choose additional libraries.

---

## Main Feature

Implement a **place search experience** with:

- a search page
- URL-driven search state
- pagination
- loading / empty / error states
- skeletons (or equivalent perceived-performance patterns)
- one public page per place

The UI design can remain minimal. Focus on structure, semantics, accessibility, and maintainability.

---

## Data

Do not build a real backend.

You may use mock data, JSON files, Supabase, Express, or Next.js route handlers to simulate an API, you're not tested on this.

The dataset should allow:

- searching places
- paginated results
- individual place pages

---

## What we expect to see

We are particularly interested in how you approach:

- rendering strategy
- caching and data fetching
- URL-driven state
- performance and perceived performance
- SEO-friendly public pages
- accessibility and semantic HTML
- code organization

Strong **Core Web Vitals** are an important success criterion.

---

## Minimum User Flows

Your application should allow a user to:

1. Open the search page
2. Search for places
3. Navigate paginated results
4. Refresh or share the URL and keep the same search state
5. Open a place detail page
6. Return to search without losing useful context

---

## Deliverables

### 1. GitHub repository containing

- the Turborepo monorepo
- the Next.js app
- the shared design system package
- the tests
- a README with setup instructions
- sample data or mock API

### 2. [ARCHITECTURE.md](http://architecture.md/)

Please include:

- overview of your solution
- main architecture decisions
- rendering strategy
- data fetching / caching approach
- URL state management approach
- what you intentionally did not implement
- what you would improve with more time

---

## Timeline

**2 to 3 days**

---

## Notes

Focus on delivering the most important parts first.

We care more about **good decisions and trade-offs** than about feature completeness.

The technical interview will include questions about your architecture and priorities.
