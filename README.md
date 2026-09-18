# Blog

A personal blog. Markdown in, static HTML out, GitHub Pages serving it.

`AGENTS.md` holds the coding guidelines, `PLAN.md` the decisions and milestones,
`PROGRESS.md` the learning state.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> build/, exactly what gets deployed
npm run preview  # serve build/
npm run check    # types and Svelte diagnostics; must be clean
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
src/content/posts/   the posts
src/lib/posts.ts     the post index, built at build time
src/lib/config.ts    site title, description, nav, links
src/lib/styles/      the whole design system, one file
src/routes/          pages, plus rss.xml and sitemap.xml
mdsvex.config.js     markdown -> component, and syntax highlighting
vite.config.ts       SvelteKit, adapter, base path
```
