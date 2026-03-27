# Migration Feedback: ESLint + Prettier → oxlint + oxfmt

## Context

Monorepo Turborepo (Next.js 16 + design system + shared configs). Migrated from `@viclafouch/eslint-config-viclafouch` v5 (ESLint) to `@viclafouch/oxc-config` v1.0.0-alpha.3 (oxlint + oxfmt).

---

## What went well

- **MIGRATION.md is excellent** — the step-by-step structure with clear "before/after" tables made the migration predictable. The config mapping table (ESLint import → oxlint import) was the most useful section.
- **Speed difference is dramatic** — oxlint finishes in ~140ms on 42 files vs ESLint taking several seconds. oxfmt finishes in ~30ms on 47 files.
- **Breaking change about `nextConfig` is well documented** — the fact that you must list `react + hooks + jsxA11y + next` explicitly instead of just `nextConfig` was a potential trap, and the migration guide calls it out clearly.
- **`import * as React` → `import React`** — good that this is documented. We had 6 files to fix.
- **Dependency cleanup is massive** — went from ~15 ESLint-related packages to 3 (`oxlint`, `oxfmt`, `@viclafouch/oxc-config`).
- **New lint rules caught a real issue** — `jsx-a11y/no-redundant-roles` caught a `role="navigation"` on a `<nav>` element that ESLint had missed.

---

## Issues encountered

### 1. Package name inconsistency in README

The README references the package as `@viclafouch/oxc-config` but nowhere does it mention the old package name `@viclafouch/oxlint-config-viclafouch`. For users migrating from the old oxlint config (intermediate step), the migration path is unclear. The MIGRATION.md only covers ESLint → oxlint, not oxlint-old-config → oxc-config.

**Suggestion:** Add a section for users already on `@viclafouch/oxlint-config-viclafouch` — it's a simple find-and-replace of the import source.

### 2. `"type": "module"` not mentioned in migration guide

oxlint/oxfmt config files use `.config.ts` which requires ESM. Node.js emits `MODULE_TYPELESS_PACKAGE_JSON` warnings if the `package.json` doesn't have `"type": "module"`. The guide mentions Node >= 22.18 but doesn't mention this requirement.

**Suggestion:** Add a note in step 2: "Ensure your `package.json` has `\"type\": \"module\"` to avoid Node.js ESM warnings when using `.config.ts` files."

### 3. Monorepo usage not covered

The migration guide assumes a single-package project. In a monorepo:
- Each workspace needs its own `oxlint.config.ts` — should this import from a shared package or directly from `@viclafouch/oxc-config`?
- `oxfmt` runs at root level (single config) while `oxlint` runs per-workspace — this distinction isn't documented.
- The `format` script should be at root only, not per-workspace — not obvious from the guide.
- Workspace packages need `@viclafouch/oxc-config` (or a wrapper) in their dependencies for the imports to resolve.

**Suggestion:** Add a "Monorepo Setup" section with an example of a shared config package pattern (centralizing `@viclafouch/oxc-config` in a workspace package and re-exporting presets).

### 4. `eslint-plugin-playwright` as a peer dependency is surprising

`eslint-plugin-playwright` is listed as a peerDependency of `@viclafouch/oxc-config`, but most projects don't use Playwright. The error message when it's missing is not helpful (module not found).

**Suggestion:** Make it an optional peer dependency (it already is, but the error UX could be improved). Consider documenting in the README that you only need to install it if you use the `playwright` config.

### 5. No guidance on `oxfmt` scope in scripts

The guide shows `oxfmt '**/*.{ts,tsx,js,jsx}'` but doesn't warn about:
- Config files (`.config.ts`) being reformatted — which is usually fine but can be surprising
- `node_modules` — oxfmt respects `.gitignore` but this isn't stated clearly
- JSON/MD/CSS files — the guide correctly warns that `oxfmt .` formats everything, but this could be more prominent

### 6. Internal composition between config presets is blocked by Node ESM vs TypeScript conflict

In a monorepo shared config package, the natural DRY approach is to compose presets: `react.ts` spreads `base.ts`, `next.ts` spreads `react.ts`. However:
- Node.js ESM requires `.ts` file extensions on relative imports (`./base.ts`)
- TypeScript rejects `.ts` extensions without `allowImportingTsExtensions` + `noEmit`
- Since the config files are consumed by `tsc --noEmit` in downstream workspaces, this creates an unsolvable conflict

The result: each preset must list all its configs individually instead of composing. This is a minor duplication but an annoying limitation.

**Suggestion:** If the package exported pre-composed arrays (see feature request #1), consumers wouldn't need to solve this themselves.

### 7. Missing `defineConfig` import source clarification

The migration guide shows `defineConfig` being used but doesn't explicitly state where it comes from. It's imported from `'oxlint'` for linting config and from `'oxfmt'` for formatting config — this could be stated once at the top.

---

## Suggestions to improve `@viclafouch/oxc-config`

### Feature requests

1. **Export pre-composed config arrays for common stacks** — e.g., `nextConfigs` that bundles `[typescript, react, hooks, jsxA11y, next, imports]` so consumers don't need to list 6+ configs every time. This would also prevent mistakes (forgetting `hooks` when using `react`).

2. **Export a `defineConfig` wrapper** — re-export `defineConfig` from `@viclafouch/oxc-config` so consumers only need one import source:
   ```typescript
   import { defineConfig, typescript, react } from '@viclafouch/oxc-config'
   ```

3. **Monorepo preset/helper** — a function like `createWorkspaceConfig({ stack: 'next', ignorePatterns: [...] })` that handles the boilerplate.

4. **Version compatibility matrix** — document which versions of `oxlint`/`oxfmt` are tested with each release of `@viclafouch/oxc-config`.

### Documentation improvements

1. Add a **Monorepo** section to both README and MIGRATION.md
2. Add a **Troubleshooting** section covering:
   - `MODULE_TYPELESS_PACKAGE_JSON` warning → add `"type": "module"`
   - `Cannot find package` → ensure the package is in dependencies
   - `import * as React` errors → use `import React from 'react'`
3. Add **before/after example diffs** for common project types (Next.js, React library, Node.js)
