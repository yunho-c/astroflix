# jekflix-astro

A modern Astro reproduction of the Jekflix theme concept: a cinematic, Netflix-inspired browsing experience for written content, rebuilt with typed content collections, static routes, accessible components, and a small amount of intentional client JavaScript.

## Requirements

- Bun 1.3.13
- Node.js 22.12.0 or newer
- A Notion internal integration shared with the posts database when using Notion content

## Commands

Run commands from the repository root:

| Command | Action |
| :-- | :-- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the local Astro dev server |
| `bun run check` | Run Astro diagnostics and type checks |
| `bun run content:sync` | Force-refresh the selected content source and generated Astro types |
| `bun run build` | Type-check and build production output to `dist/` |
| `bun run preview` | Preview the production build locally |

## Content Sources

The post collection can load local Markdown or a Notion database at build time. Copy `.env.example` to `.env` to select a source explicitly.

### Markdown

Markdown is the default and does not require environment variables:

```sh
CONTENT_SOURCE=markdown
```

Posts are loaded from `src/content/posts/`. The filename becomes the post slug unless frontmatter provides an explicit `slug`.

### Notion

Set all three variables to use Notion:

```sh
CONTENT_SOURCE=notion
NOTION_TOKEN=
NOTION_DATABASE_ID=
```

The database must be shared with the integration that owns `NOTION_TOKEN`. Notion-hosted assets are downloaded to the gitignored `src/assets/notion/` cache.

Required database properties:

| Property | Type | Notes |
| :-- | :-- | :-- |
| `Title` | Title | Post title |
| `Slug` | Rich text | Lowercase URL slug, such as `cinematic-homepages` |
| `Subtitle` | Rich text | Hero/post lede; falls back to description or title |
| `Description` | Rich text | SEO/search/card description; falls back to subtitle or title |
| `Status` | Status | Only `Published` posts build |
| `Published At` | Date | Public publish date |
| `Updated At` | Date | Optional modified date |
| `Author` | Select | Must match a local author ID |
| `Category` | Select | Category label |
| `Tags` | Multi-select | Tag labels |
| `Cover URL` | URL | Optional card/hero image URL; bare hosts are normalized to `https://` |
| `Cover Alt` | Rich text | Optional image alt text; falls back to title |
| `Featured` | Checkbox | Homepage hero candidate |

Authors remain local Markdown in both modes. For Cloudflare Pages, configure `CONTENT_SOURCE=notion`, store `NOTION_TOKEN` as an encrypted secret, and set `NOTION_DATABASE_ID` as an environment variable for each deployment environment that builds Notion content.

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
│   ├── content-sources/
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

Posts come from the configured Markdown or Notion source, and authors live in `src/content/authors/`. Each post references an author by collection ID and includes title, subtitle, description, publication date, category, tags, image metadata, and optional featured/draft flags.

Site-level navigation, social links, and brand copy live in `src/data/site.ts`.
