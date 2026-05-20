# jekflix-astro

A modern Astro reproduction of the Jekflix theme concept: a cinematic, Netflix-inspired browsing experience for written content, rebuilt with typed content collections, static routes, accessible components, and a small amount of intentional client JavaScript.

## Requirements

- Bun 1.3.13
- Node.js 22.12.0 or newer
- A Notion internal integration shared with the posts database

## Commands

Run commands from the repository root:

| Command | Action |
| :-- | :-- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the local Astro dev server |
| `bun run check` | Run Astro diagnostics and type checks |
| `bun run content:sync` | Force-refresh Notion content and generated Astro types |
| `bun run build` | Type-check and build production output to `dist/` |
| `bun run preview` | Preview the production build locally |

## Notion Content

Blog posts are loaded from a Notion database through `@ntcho/notion-astro-loader`. Copy `.env.example` to `.env` and set `NOTION_TOKEN` before running Astro commands locally:

```sh
NOTION_TOKEN=
NOTION_DATABASE_ID=3652acb28f77803e9b1fdff413ef2daf
```

The Notion database must be shared with the integration that owns `NOTION_TOKEN`.
GitHub Actions also expects `NOTION_TOKEN` as a repository secret. `NOTION_DATABASE_ID` can be set as a repository variable when it differs from the default in `.env.example`.

Required post properties:

| Property | Type | Notes |
| :-- | :-- | :-- |
| `Title` | Title | Post title |
| `Slug` | Rich text | Lowercase URL slug under `/posts/`, e.g. `cinematic-homepages` |
| `Subtitle` | Rich text | Hero/post lede; falls back to description/title when empty |
| `Description` | Rich text | SEO/search/card description; falls back to subtitle/title when empty |
| `Status` | Status | Only `Published` posts build |
| `Published At` | Date | Public publish date |
| `Updated At` | Date | Optional modified date |
| `Author` | Select | Must match a local author slug |
| `Category` | Select | Category label |
| `Tags` | Multi-select | Tag labels |
| `Cover URL` | URL | Stable card/hero image URL; bare hosts are normalized to `https://` |
| `Cover Alt` | Rich text | Accessible image alt text; falls back to title when empty |
| `Featured` | Checkbox | Homepage hero candidate |

Local author profiles are still stored in `src/content/authors`. The existing Markdown posts are retained as sample source material, but production post routes use Notion.

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
