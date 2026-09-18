# PROGRESS.md

Nils's proficiency per topic, so the agent knows when to teach and when to just
build. Levels:

* **not started** — not touched yet.
* **taught** — the fundamentals have been explained; no code written yet.
* **implemented** — written by Nils, or written together and understood.
* **fluent** — used repeatedly, no explanation needed.

**Rule:** in any topic below `implemented`, explain the fundamentals *before*
writing code — the data, the reason for that shape, what the browser or the
build does with it. At `implemented` or above, implement directly and flag only
surprises.

Background: web, cloud and backend development. HTTP, git, CI/CD and domain
modelling are not new. The browser as a platform, the Svelte compiler, and CSS
as a design system are.

**Note on M0:** the skeleton was built in one pass to have something real to
learn against, so most topics below sit at `taught` — the code exists and is
commented, but Nils has not written it. Anything still at `taught` gets
explained before it is next changed.

| Topic | Level | Note |
|---|---|---|
| Svelte 5 runes (`$state`, `$derived`, `$props`) | taught | `ThemeToggle.svelte`, `+layout.svelte` |
| `$effect` and when *not* to use it | not started | M1, the one people get wrong |
| Component boundaries and props | taught | M1 |
| Snippets and `{@render}` | taught | `+layout.svelte` children |
| SvelteKit routing and `+page`/`+layout` | taught | M0 |
| `load` functions, universal vs server | taught | M0, only universal here |
| Prerendering and the crawler | taught | M0, `entries()` in `posts/[slug]` |
| `adapter-static` and the output shape | taught | M0 |
| Base paths and `$app/paths` | taught | M0, the GitHub Pages trap |
| `import.meta.glob` and build-time data | taught | M0, `src/lib/posts.ts` |
| mdsvex and markdown preprocessing | taught | M1 |
| Frontmatter validation | taught | M0 |
| Shiki and build-time highlighting | taught | M0 |
| CSS custom properties as design tokens | taught | M3 |
| Dark mode without a flash | taught | M0, the inline script in `app.html` |
| Scoped styles and the cascade in Svelte | not started | M3 |
| Fluid type and spacing scales | not started | M3 |
| RSS 2.0 | taught | M2 |
| Sitemaps and `robots.txt` | taught | M2 |
| Open Graph and structured data | not started | M2 |
| GitHub Actions workflows | taught | M0 |
| GitHub Pages deployment and artifacts | taught | M0 |
| Lighthouse and Core Web Vitals | not started | M4 |
| Keyboard navigation and focus management | not started | M4 |
| ARIA and semantic HTML | not started | M4 |
| Vite build pipeline and chunking | not started | M4 |

## Learning notes

Recorded when a Tier 2 topic moves from hand-written to using the library
version, per `AGENTS.md`.

*(none yet)*
