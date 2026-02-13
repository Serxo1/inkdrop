# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server (Next.js on localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint (flat config, `eslint.config.mjs`)
- No test framework is configured

## Tech Stack

- **Next.js 16** with App Router, React 19, TypeScript
- **Tailwind CSS v4** (via `@tailwindcss/postcss`, configured in `postcss.config.mjs`; no `tailwind.config` file)
- **shadcn** (style: `base-vega`) — UI components in `components/ui/`, built on **@base-ui/react** primitives
- **Icons**: `@hugeicons/react` + `@hugeicons/core-free-icons` (use `<HugeiconsIcon icon={...} strokeWidth={2} />`)
- **Styling utilities**: `class-variance-authority` for component variants, `clsx` + `tailwind-merge` via `cn()` from `lib/utils.ts`

## Architecture

- `app/` — Next.js App Router. Single page (`page.tsx`) renders `ComponentExample`.
- `components/ui/` — shadcn components (button, card, input, select, combobox, dropdown-menu, alert-dialog, etc.). These use `@base-ui/react` primitives, not Radix.
- `components/` — App-level components (`example.tsx` provides layout wrappers, `component-example.tsx` showcases UI components).
- `lib/utils.ts` — `cn()` helper for merging Tailwind classes.

## Conventions

- Path alias: `@/*` maps to project root (e.g., `@/components/ui/button`).
- shadcn config in `components.json` — icon library is `hugeicons`, base color is `neutral`, CSS variables enabled.
- Theme tokens defined as CSS custom properties in `app/globals.css` using OKLCH color space (light/dark themes via `.dark` class).
- Components use `data-slot` attributes for identification.
- UI components are client components (`"use client"`) that wrap `@base-ui/react` primitives.
