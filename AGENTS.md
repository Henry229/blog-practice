# Repository Guidelines

## Project Structure & Module Organization
Source lives under `app/` using the Next.js App Router; route segments map directly to pages, while server-only helpers sit in `app/(server)` subfolders when needed. Shared UI primitives reside in `components/`, and cross-cutting logic (Supabase clients, auth helpers, utility functions, and typed env loaders) is in `lib/` with Supabase-specific code under `lib/supabase/`. Static assets and fonts belong in `public/`. Infrastructure and SQL migrations stay in `supabase/`. Favor colocating feature-specific files inside their route segment with `page.tsx`, `layout.tsx`, and `loading.tsx` neighbours for clarity.

## Build, Test, and Development Commands
- `npm run dev` — start the local Next.js dev server on port 3000 with hot reload, including Supabase SSR hooks.
- `npm run build` — compile the production bundle; run this before opening PRs to ensure server components and Route Handlers type-check.
- `npm run start` — serve the optimized build locally to reproduce production behavior.
- `npm run lint` — run ESLint using `eslint.config.mjs`; linters fail the pipeline, so resolve warnings before committing.

## Coding Style & Naming Conventions
Use TypeScript everywhere and keep modules in strict ESM. Components and hooks use PascalCase filenames (`components/PostCard.tsx`, `lib/hooks/useProfile.ts`). Favor functional components with early returns and 2-space indentation. Tailwind CSS v4 is the primary styling tool; keep utility classes ordered logically (layout → spacing → aesthetics) and extract repeated combos into shadcn-style components. Run `npm run lint` to apply the shared eslint-config-next rules; add lightweight comments only to explain business logic or Supabase access patterns.

## Testing Guidelines
Automated tests are not yet scaffolded. When adding coverage, place unit tests beside the implementation (`component.test.tsx`) or in a colocated `__tests__/` directory, and use Testing Library with Vitest or Jest for React output. New features should include tests that cover route rendering, auth edge cases, and error states. Until a formal test runner lands, rely on linting plus manual verification in `npm run dev`; document any remaining gaps in the PR description.

## Commit & Pull Request Guidelines
Follow the existing imperative tone from history (`Add authentication system with Supabase integration`). Commits should be scoped to one concern and reference tickets when applicable. For PRs, include: purpose summary, screenshots of affected UI states (desktop + mobile), steps to reproduce/test, and notes about Supabase env vars or migrations (e.g., update `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`). Request review only after `npm run build && npm run lint` succeed locally.
