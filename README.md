# jekflix-astro

A modern Astro reproduction of the Jekflix theme concept: a cinematic, Netflix-inspired browsing experience for written content, rebuilt with typed content collections, static routes, accessible components, and a small amount of intentional client JavaScript.

## Requirements

- Bun 1.3.13
- Node.js 22.12.0 or newer

## Commands

Run commands from the repository root:

| Command | Action |
| :-- | :-- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the local Astro dev server |
| `bun run check` | Run Astro diagnostics and type checks |
| `bun run build` | Type-check and build production output to `dist/` |
| `bun run preview` | Preview the production build locally |

## Project Structure

```text
/
├── .github/workflows/
│   └── ci.yml
├── public/
├── src/
│   ├── components/
│   ├── content/
│   │   ├── authors/
│   │   └── posts/
│   ├── data/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── src/content.config.ts
├── astro.config.mjs
└── package.json
```

## Features

- Home page with a featured cinematic hero, post grid, categories, and tag shortcuts.
- Typed post and author collections in `src/content.config.ts`.
- Post pages with reading progress, metadata, author panel, sharing links, and related recommendations.
- Live local search with a static fallback path when JavaScript is disabled.
- Tag, category, author, about, contact, message-sent, 404, RSS, and sitemap routes.
- Dark visual system inspired by the original Jekflix product idea without mechanically porting the legacy Jekyll implementation.

## Content

Posts live in `src/content/posts/` and authors live in `src/content/authors/`. Each post references an author by collection id and includes title, subtitle, description, publication date, category, tags, image metadata, and optional featured/draft flags.

Site-level navigation, social links, and brand copy live in `src/data/site.ts`.
