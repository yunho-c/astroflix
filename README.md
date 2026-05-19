# jekflix-astro

Astro project scaffolded with Bun, strict TypeScript settings, local type checks, and CI-ready build validation.

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
│   └── pages/
│       └── index.astro
├── astro.config.mjs
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.
