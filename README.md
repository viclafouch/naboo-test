# Naboo Places

A place discovery platform built as a Turborepo monorepo with Next.js 16 App Router.

## Prerequisites

- Node.js 20+
- pnpm 9+

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
```

## Lint & Type Check

```bash
pnpm lint        # TypeScript + ESLint
pnpm lint:fix    # TypeScript + ESLint auto-fix
pnpm check-types # TypeScript only
```

## Tests

```bash
pnpm test:e2e
```

Requires Playwright browsers installed:

```bash
pnpm exec playwright install --with-deps chromium
```

## Monorepo Structure

```
apps/web/                  Next.js 16 application
packages/design-system/    Shared UI components (shadcn/ui + Base UI)
packages/eslint-config/    Shared ESLint configurations
packages/typescript-config/ Shared TypeScript configurations
```
