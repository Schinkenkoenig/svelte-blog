---
title: This blog, and how it is put together
description: A static SvelteKit site, markdown posts, and a GitHub Actions workflow that is the only way anything gets deployed.
date: 2026-09-18
tags: [meta, svelte]
---

I needed somewhere to put notes from the chess engine I am writing in Odin, so
this exists now. It is deliberately small: markdown files in a folder, a
SvelteKit build that turns them into HTML, and GitHub Pages serving the result.

## How a post becomes a page

A post is a file in `src/content/posts/`. Its frontmatter carries the title,
date and description:

```markdown
---
title: This blog, and how it is put together
description: A short line for the index and the feed.
date: 2026-09-18
tags: [meta, svelte]
draft: false
---
```

At build time `import.meta.glob` resolves that folder into a list of modules.
The metadata becomes the index; the bodies become lazily-loaded components. No
filesystem is touched at runtime, which is the point &mdash; there is no runtime.

```ts
const files = import.meta.glob<{ metadata: Frontmatter }>('/src/content/posts/*.md', {
	eager: true
});
```

A post missing a title or a malformed date throws during the build rather than
rendering `undefined` into a page. Loud beats late.

## Deployment

There is no deploy command. Pushing to `main` is the deploy: the workflow
builds the site and publishes it to Pages. Anything I can do by hand, I will
eventually do wrong at 1am, so the pipeline owns it.

Drafts are the exception the other way around: `draft: true` keeps a post
visible in `npm run dev` and absent from the build, so unfinished writing can
live on the branch without a second environment.
