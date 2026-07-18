# Jekflix Astro

A reusable Astro template for a cinematic, Netflix-inspired publication. It combines typed content, static routes, accessible browsing, and a small amount of intentional client JavaScript while preserving the product spirit of the original Jekflix theme.

## Start a publication

Requirements:

- Bun 1.3.14
- Node.js 22.12.0 or newer
- A Notion integration shared with the posts database only when using Notion content

Install and run the Markdown demo:

```sh
bun install
bun run dev
```

Before publishing a site created from this template:

1. Edit `src/data/site.ts`: replace the example canonical URL, site identity, navigation, social links, theme colors, and optional contact settings.
2. Replace the demo posts, authors, About/Contact Markdown, and favicon.
3. Choose Markdown or Notion with `CONTENT_SOURCE`.
4. Run `bun test`, `bun run check`, and `bun run build`.
5. Review the attribution setting and retain required source notices.

The checked-in URL is deliberately `https://jekflix-astro.example.com`; it is not suitable for a production deployment.

## Commands

| Command | Action |
| :-- | :-- |
| `bun install` | Install the pinned dependency graph |
| `bun run dev` | Start the Astro development server |
| `bun test` | Run configuration and content integrity tests |
| `bun run check` | Run Astro and TypeScript diagnostics |
| `bun run content:sync` | Force-refresh the selected content source and generated Astro types |
| `bun run build` | Check and build production output to `dist/` |
| `bun run audit` | Fail on moderate-or-higher dependency advisories |
| `bun run preview` | Preview the production build locally |

## Public configuration

`src/data/site.ts` is the single source-controlled configuration surface for public, non-secret settings. It is validated when Astro loads.

| Area | Settings |
| :-- | :-- |
| Identity | Name, title, description, canonical URL, and language |
| Theme | Accent and browser theme colors |
| Navigation | Header/sidebar and footer links |
| Social | Explicit URL, label, and icon (`github`, `rss`, `x`, `linkedin`, `website`, or `email`) |
| Header | Optional badge and call to action |
| Footer | Optional visible Jekflix attribution, enabled by default |
| Contact | Optional public email and optional form action |
| Content | Default cover URL used when Notion has no cover |

The canonical URL drives Astro, canonical tags, sharing URLs, RSS, sitemap, and `robots.txt`. Date formatting and font selection derive from the configured language.

Font links, font faces, and language-specific stacks remain in `src/data/fonts.ts` because they are a specialized design-system concern; their default language comes from the site configuration.

## Content sources

Posts can load from local Markdown or a Notion database at build time. Copy `.env.example` to `.env` to select a source locally. Environment variables select infrastructure and hold secrets; branding stays in the typed site configuration.

### Markdown

Markdown is the default:

```sh
CONTENT_SOURCE=markdown
```

Posts load from `src/content/posts/`. The filename becomes the route slug unless frontmatter provides an explicit lowercase ASCII `slug`.

Authors load from `src/content/authors/` in both content modes. About and Contact copy load from `src/content/pages/`, keeping downstream editorial changes separate from route code.

### Notion

Set all three variables for Notion builds:

```sh
CONTENT_SOURCE=notion
NOTION_TOKEN=
NOTION_DATABASE_ID=
```

The database must be shared with the integration that owns `NOTION_TOKEN`. Notion assets are downloaded to the gitignored `src/assets/notion/` cache.

Required database properties:

| Property | Type | Notes |
| :-- | :-- | :-- |
| `Title` | Title | Post title |
| `Slug` | Rich text | Lowercase ASCII route slug such as `cinematic-homepages` |
| `Subtitle` | Rich text | Falls back to description or title |
| `Description` | Rich text | Falls back to subtitle or title |
| `Status` | Status | Only `Published` posts build |
| `Published At` | Date | Public publication date |
| `Updated At` | Date | Optional modified date |
| `Author` | Select | Must match a local author ID |
| `Category` | Select | Category label |
| `Tags` | Multi-select | Tag labels |
| `Cover URL` | URL | Optional; falls back to the site configuration |
| `Cover Alt` | Rich text | Optional; falls back to the title |
| `Featured` | Checkbox | Homepage hero candidate |

Builds reject unknown authors, duplicate post routes, taxonomy labels that create empty slugs, and distinct taxonomy labels that collide at the same URL. Tags and categories support Unicode labels and Unicode-safe derived routes.

## Contact forms

The default Contact page shows configured email/social links and does not render a form. To enable a form, set `site.contact.formAction` to an HTTPS form-provider endpoint or a root-relative server endpoint. The form then submits with `POST`.

This static project does not process email itself. Configure redirects, spam controls, and delivery with the provider. `/message-sent/` is available as an optional redirect target but is not used to simulate a successful submission.

## Cloudflare Pages

For a publication created from this template, use a separate repository rather than deploying this template repository directly.

Recommended Pages settings:

| Setting | Value |
| :-- | :-- |
| Production branch | `main` |
| Build command | `bun run build` |
| Output directory | `dist` |
| Environment variable | `BUN_VERSION=1.3.14` |

For a Notion-backed site, set `CONTENT_SOURCE=notion`, store `NOTION_TOKEN` as an encrypted secret, and set `NOTION_DATABASE_ID` for every environment that builds content. Create a Cloudflare Pages deploy hook so publishing in Notion can trigger a rebuild without a Git commit.

Keep this repository as an `upstream` or `template` remote in the publication repo if you want to merge future template improvements deliberately.

## Project structure

```text
/
├── public/
├── src/
│   ├── components/
│   ├── content/{authors,pages,posts}/
│   ├── content-sources/
│   ├── data/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── tests/
├── astro.config.ts
└── src/content.config.ts
```

The template includes a featured homepage, post grid, article pages, reading progress, deterministic recommendations, search, author/tag/category archives, RSS, sitemap, robots metadata, 404, and optional form-confirmation routes. The footer uses static Astro icon components and adds no client-side icon runtime.

## Security and licensing

CI uses a frozen lockfile and fails on moderate-or-higher dependency advisories. See [SECURITY.md](SECURITY.md) for the currently accepted low-severity development-server advisory.

Jekflix Astro is MIT licensed. It is an independent reproduction informed by the original Jekflix product and visual ideas. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution and dependency notices.
