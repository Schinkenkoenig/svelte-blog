# Blog

A personal blog. Markdown in, static HTML out, GitHub Pages serving it.

`AGENTS.md` holds the coding guidelines, `PLAN.md` the decisions and milestones,
`PROGRESS.md` the learning state.

## Running it

Node and pnpm are pinned in `mise.toml`. With [mise](https://mise.jdx.dev)
installed, `mise install` gets both.

```bash
pnpm install
pnpm dev           # http://localhost:5173
pnpm build         # -> build/, exactly what gets deployed
pnpm preview       # serve build/

pnpm test          # unit tests (vitest)
pnpm test:watch
pnpm check         # types and Svelte diagnostics; must be clean
pnpm lint          # eslint, correctness rules only
pnpm format        # prettier, owns formatting

pnpm verify        # everything above, in CI's order. Run before pushing.
```

## Writing a post

Create `src/content/posts/<slug>.md`. The filename is the URL.

```markdown
---
title: Bitboards, or why a chess position is three 64-bit integers
description: One line, shown on the index and in the feed.
date: 2026-09-18
tags: [chess, odin]
draft: false
---

Body starts here.
```

`title` and `date` are required; a post missing either fails the build.
`draft: true` shows the post in `npm run dev` and keeps it out of the build.

## Deploying

Push to `main`. That is the whole procedure — the workflow in
`.github/workflows/deploy.yml` builds the site and publishes it to Pages.
Nothing is deployed by hand.

## Layout

```
src/content/posts/      the posts
src/lib/posts.ts        what a post is + every operation on a list of them (pure)
src/lib/content.ts      binds those to the real .md files via import.meta.glob
src/lib/feed.ts         RSS and sitemap generators (pure)
src/lib/config.ts       site title, description, nav, links
src/lib/styles/         tokens.css (the palette and scales) + app.css (the rest)
src/routes/             pages, plus rss.xml and sitemap.xml
mdsvex.config.js        markdown -> component, and syntax highlighting
vite.config.ts          SvelteKit, adapter, base path, Lightning CSS
vitest.config.ts        tests; deliberately does not load the SvelteKit plugin
```

`posts.ts` is pure and `content.ts` holds the glob. That split is why the tests
run in milliseconds — keep it.

## Design tokens

`src/lib/styles/tokens.css` is the only file where a raw colour or size appears,
in two layers: primitives (`--blue-500`, `--space-4`) and semantic names
(`--bg`, `--text-muted`, `--font-title`) that point at them. Components use
semantic names only.

- Recolour the site: repoint the semantic names.
- Change the palette: edit the primitives, every semantic name follows.
- Neither requires touching a component.

Colours are authored in oklch with all neutrals at the accent's hue, so the
greys and the accent are one family. Lightning CSS emits fallbacks per the
`browserslist` field in `package.json`.
