# PLAN.md

What we are building, in what order, and which decisions are already settled.
Written 2026-09-18. Coding guidelines live in `AGENTS.md`; learning state lives
in `PROGRESS.md`.

## Goal

A personal blog that is genuinely mine: content in markdown in git, no CMS, no
platform, no runtime. Three learning targets:

1. **Svelte 5** — runes, component boundaries, what the compiler does.
2. **The static-site pipeline** — how a folder of markdown becomes a folder of
   HTML, and what the build has to know to do that.
3. **GitOps deployment** — the repository is the deployment. A push to `main` is
   the only way anything changes.

## Settled decisions

- **SvelteKit with `adapter-static`.** Every route is prerendered; the output is
  plain files. This is enforced, not encouraged: `prerender = true` sits on the
  root layout, so a route that cannot be prerendered is a build error. That is
  also what keeps GitHub Pages viable as the host.
- **No `svelte.config.js`.** Current SvelteKit takes its own options and
  vite-plugin-svelte's options through the `sveltekit()` plugin in
  `vite.config.ts` and splits them internally. One config file, not two.
- **Markdown via `mdsvex`** (Tier 1). CommonMark plus GFM is a large settled
  spec, and writing a parser for it teaches parsing, not the web. What we own is
  everything around it: the post index, frontmatter validation, prerendering,
  feeds. Reading pointer before the next change here: the CommonMark spec's
  introduction, and mdsvex's README on `extensions` and `highlight`.
- **Posts are components, not strings.** `.md` is registered as a Svelte
  component extension, so a post compiles to a component and can embed Svelte
  when a post genuinely needs it. Posts stay plain markdown by default
  (`AGENTS.md`, Content).
- **The index is built at build time** by `import.meta.glob`. Nothing reads the
  filesystem at runtime, because there is no runtime. `src/lib/posts.ts` is the
  single source of truth for what a post is.
- **The slug is the filename.** Two sources of truth for a URL is one too many.
- **Frontmatter is validated during the build.** A post without a title or with
  a malformed date throws. Finding out at build time is the whole point of
  having a build.
- **Syntax highlighting with `shiki` at build time** (Tier 1), emitting both
  themes at once as CSS variables. No highlighter ships to the browser, and
  theme switching is a CSS rule rather than a re-render.
- **Dark by default, blue-leaning neutrals.** The greys carry blue so the accent
  belongs to the same family. Light mode exists and is a token override, not a
  second stylesheet. The theme is applied by a blocking inline script in
  `app.html` before first paint, because anything deferred paints white first.
- **No webfonts.** System font stack. A blog is text; text should not wait on a
  network request to become visible.
- **No CSS framework** (Tier 3). The entire stylesheet is one readable file.
- **`trailingSlash: 'always'`.** GitHub Pages resolves `/posts/foo/` to
  `index.html` but will not rewrite `/posts/foo`. Directories with `index.html`
  are what Pages actually serves.
- **`BASE_PATH` set by CI.** A project page lives at `/<repo>`, so the base path
  is baked in at build time. Local development runs at the root.
- **Deployment is `.github/workflows/deploy.yml` and nothing else.** Push to
  `main` builds and publishes. Pull requests run the same build without
  deploying, so a broken post is a review-time problem.
- **`npm run check` runs in CI before the build.** A type error in a route
  should stop the pipeline, not ship as a broken page.
- **Drafts are `draft: true`:** visible in `npm run dev`, absent from the build.
  Unfinished writing lives on a branch; there is no staging environment.

## Postponements — deliberate, revisit explicitly

- **No test framework yet.** The build is strict enough to be the test: it
  resolves every internal link and fails on a malformed post. A test framework
  arrives the first time something breaks that a test would have caught.
- **No comments, no analytics, no search.** Each is a third-party script or a
  server, and this site has neither. Reconsider individually, with a reason.
- **No tag pages, no pagination, no archive.** They are a function of the post
  index and can be added in an afternoon; they are not worth building for six
  posts.
- **No image pipeline.** Images go in `static/` at the size they should be
  served. Revisit when a post actually needs many of them.
- **No full-content RSS.** The feed carries descriptions and links. Full content
  means rendering each post to a string at build time, which is doable but not
  yet earned.
- **No custom domain yet.** Living at `/<repo>` is what forces the base-path
  handling to be correct, which is the bug that bites later either way.

## Open decisions

Tracked as issues; the gate is what must not start before they are settled.

| Decision                                          | Issue                  | Gates |
| ------------------------------------------------- | ---------------------- | ----- |
| Custom domain, or stay on `github.io`             | [#13](../../issues/13) | M4    |
| Typography: system stack, or one self-hosted font | [#14](../../issues/14) | M3    |
| Formatter and pre-commit hook setup               | [#15](../../issues/15) | M1    |

### Settled since

- **#15 — formatter and hooks.** Prettier (opinionated, owns formatting) plus
  ESLint (correctness only, no style rules). **No pre-commit hook:** `AGENTS.md`
  forbids skipping hooks, so a hook that is slow or annoying becomes a problem
  rather than being bypassed. The same checks run in CI, where they cannot be
  skipped and cost nothing locally. `pnpm verify` is the local equivalent, run
  by choice.

## Milestones

Step detail lives in the GitHub issues, which are the working list. This file
keeps the decisions and the reasons for them, which issues are bad at holding.

|     | Milestone                                                | Issue                       | Gated by        |
| --- | -------------------------------------------------------- | --------------------------- | --------------- |
| M0  | Skeleton: SvelteKit, mdsvex, one post, CI to Pages       | [#1](../../issues/1) (done) |                 |
| M1  | Content pipeline: validation, drafts, tags, reading time | [#2](../../issues/2)        | #7, #8, #9, #15 |
| M2  | Feeds and metadata: RSS, sitemap, Open Graph, JSON-LD    | [#3](../../issues/3)        | #10             |
| M3  | Design pass: type scale, spacing, dark/light audit       | [#4](../../issues/4)        | #11, #14        |
| M4  | Performance and a11y: Lighthouse, keyboard, contrast     | [#5](../../issues/5)        | #12, #13        |
| M5  | Writing: three real posts                                | [#6](../../issues/6)        | M1              |

Order: M0, M1, M2, M3, M4, M5 — but M5 can start any time, and should. A blog
with no posts is a static site generator.

Issue labels: `milestone` for implementation, `decision` for open design
questions, `learning` for reading that must be done first. A `learning` issue
blocking a milestone is closed before that milestone starts.

Milestone issues are written out step by step when the milestone starts, not
before.
