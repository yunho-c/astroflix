# Agent Notes

## Project Goal

Astroflix is a modern reproduction of the Jekflix theme. The original Jekflix template is a Jekyll theme inspired by Netflix-style browsing, adapted for a blog/content site. This repo should preserve that strong visual and product idea while rebuilding it with modern frontend practices, maintainable components, typed data, and a clean development workflow.

The local reference copy of the original template is available at:

```text
/Users/yunhocho/GitHub/jekflix-template
```

Use the reference template to understand behavior, content model, layout intent, visual hierarchy, and feature scope. Do not treat it as code to mechanically port. Prefer modern framework-native implementations over translating Liquid, Sass, Gulp, or old JavaScript one-to-one.

## Current Stack

- Astro is currently scaffolded as the app shell.
- Bun is the package manager.
- TypeScript checking is expected through `astro check`.
- Svelte/SvelteKit-style component architecture is the intended direction for interactive UI work. In this Astro repo, prefer Svelte islands/components where they fit. If the project later moves fully to SvelteKit, keep the same product goals and feature priorities.
- Tailwind CSS and shadcn-svelte are appropriate candidates when they improve speed, consistency, accessibility, and maintainability.

## Reference Template Summary

The original template is `jekflix-template` version 3.1.2. It is a Jekyll/Liquid/Sass/Gulp project with layouts, includes, pages, posts, authors, and static JavaScript utilities.

Important reference areas:

- `_layouts/` for page structure and route-level templates.
- `_includes/` for reusable UI regions such as header, menu, footer, search, modal, progress bar, sharing, recommendations, author info, pagination, and post metadata.
- `_sass/` and `assets/css/styles.scss` for the visual system, spacing, responsive behavior, typography, and theme colors.
- `src/js/main/` for legacy interaction behavior such as search, reading progress, recommendations, menu behavior, smooth scrolling, and exit/finish modals.
- `_config.yml` for the original content/settings model and feature toggles.
- `docs/` for documented behavior and configuration.

## Product Motivation

The goal is not simply "make a blog." The project should feel like a polished media browsing experience for written content:

- Strong first impression with a cinematic hero/featured post area.
- Dense, scannable post cards inspired by streaming-service browsing.
- Fast discovery through search, tags, categories, authors, and recommendations.
- Comfortable reading pages with progress, metadata, sharing, author context, and navigation to related content.
- Useful static-site fundamentals: SEO, feeds, sitemap, accessible navigation, good performance, and graceful behavior without unnecessary client JavaScript.

## Feature Targets

When implementing features, use this list as the initial product map:

- Home page with hero/featured content.
- Post card grid/list with responsive behavior and optional two-column layout.
- Blog post pages with metadata, estimated reading time, reading progress, author section, sharing, and related/recommended posts.
- Search experience comparable to the original live search.
- Tags and categories pages.
- Author/staff pages.
- About, contact, 404, and message-sent pages.
- RSS/feed and sitemap support.
- Theme configuration for core colors, branding, menu links, social links, language, and optional feature toggles.
- Optional integrations such as analytics, comments, forms, and modal prompts should be isolated and easy to disable.

## Implementation Principles

- Preserve the spirit and behavior of Jekflix, not its legacy implementation details.
- Prefer typed content collections or structured data over ad hoc frontmatter parsing.
- Prefer framework routing, components, and build-time data APIs over custom DOM scripts.
- Keep client JavaScript intentional. Use islands/interactivity only where needed.
- Build accessible controls and navigation from the start.
- Keep components small enough to map to product concepts: hero, post card, post grid, search, menu, progress bar, author bio, recommendation rail, pagination, layout shell.
- Avoid global CSS sprawl. Use a clear design-token strategy, Tailwind utilities, component-scoped styles, or a deliberate mix that remains easy to reason about.
- Do not vendor or copy large chunks from the original template unless there is a specific asset or text that is license-safe and intentionally reused.

## Visual Direction

The UI should reference the original Netflix-inspired Jekflix feel: dark cinematic surfaces, bold imagery, strong post cards, sharp hierarchy, and smooth browsing. It should still feel modern, accessible, responsive, and content-first rather than like a dated clone.

Important visual qualities:

- High-contrast dark theme with a focused accent color.
- Image-forward cards and hero areas.
- Clear hover/focus states.
- Compact but readable metadata.
- Mobile navigation that feels native and efficient.
- Reading pages that are calmer than the browsing surfaces.

## Commands

Use these commands from the repository root:

```sh
bun install
bun run dev
bun run check
bun run build
bun run preview
```

Before handing off implementation changes, run:

```sh
bun run build
```

For documentation-only changes, a build is not required unless package/config behavior changed.

## Git And Repo Hygiene

- Keep changes focused and easy to review.
- Do not commit generated directories such as `dist/`, `.astro/`, or `node_modules/`.
- Preserve user changes in the worktree. Do not reset, checkout, or remove unrelated files.
- If using assets or design details from the original template, confirm license compatibility and document the choice where it matters.

## Current Architecture

- Public, non-secret site settings are validated in `src/data/site.ts`; environment variables select the post source and hold Notion credentials only.
- Posts can come from typed local Markdown or Notion. Authors and customizable About/Contact pages remain typed local Markdown in both modes.
- Shared content helpers validate author references, post-route uniqueness, and Unicode-safe taxonomy routes during builds.
- Astro components render the static browsing and reading experience. Client JavaScript is limited to search, the mobile menu, header tone, and reading progress.

## Near-Term Direction

The template baseline is intended to stay generic while publications created from it own their branding, content, deployment settings, and secrets. Useful future work includes:

- Continue visual and accessibility comparisons against the original template without porting legacy implementation details.
- Add optional integrations behind typed, disabled-by-default configuration boundaries.
- Keep Markdown and Notion behavior aligned whenever the post model or rendering pipeline changes.
- Preserve zero-content builds, deterministic static output, and the small client-JavaScript budget.
