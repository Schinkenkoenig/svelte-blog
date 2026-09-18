# AGENTS.md

Coding guidelines for this repository. This file supersedes the global
`~/.claude/CLAUDE.md` wherever the two disagree. It is written for both Nils and
any agent working here.

This is a _learning_ project with a real deliverable. Nils is learning Svelte,
the browser platform, and how a static site is actually assembled. The blog has
to work and stay online; that is what makes the learning honest. Shipping fast
is not the goal.

## Project

A personal blog: markdown posts, SvelteKit, prerendered to static files, served
by GitHub Pages, deployed by GitHub Actions on push to `main`. See `PLAN.md` for
milestones and settled decisions, `PROGRESS.md` for what Nils has learned.

## Teaching

- Before writing code in a topic Nils has not yet reached `implemented` in
  `PROGRESS.md`, explain the fundamentals first: what the data looks like, why
  it is shaped that way, what the browser or the build actually does with it.
- At `implemented` or above, just implement it, and point out only what is
  surprising.
- Never hand over code that Nils cannot explain back. If a step needs a trick,
  the trick gets explained.
- Update `PROGRESS.md` when a topic's level changes.

## Comments

- Every file starts with a comment saying what the file does and why it exists.
- Comments explain what happens **outside** the code: decisions and the reasons
  for them, postponed work, temporary workarounds, known problems, browser
  quirks, references to specs.
- Comments do not restate what the code plainly says, and they never record
  history ("changed X to Y"). Git holds history.
- Phase comments inside long functions are encouraged: they are the table of
  contents of the procedure.

## Structure

- Data first. The post index is a list of plain objects built at build time;
  everything else is a function of that list. Design the data, then the code
  that transforms it.
- A component is extracted when it is genuinely reused or genuinely independent,
  not to hit a line count. A 150-line route with clear sections beats six files.
- Write the usage code first, then compress the repetition into an abstraction.
  No abstraction for a second use case that does not exist yet.
- Stores and context are for state that genuinely spans routes. Props first.
- No client-side state that the server could have decided at build time.

## Svelte

- Runes only (`$state`, `$derived`, `$effect`, `$props`). No legacy reactive
  labels, no `export let`.
- `$effect` is for synchronising with something outside Svelte (the DOM, a
  timer, storage). Deriving a value from other values is `$derived`, never an
  effect writing to state.
- Component styles stay in the component's `<style>` block. Global tokens and
  prose styling live in `src/lib/styles/app.css`, which is the only global CSS.
- Every colour, spacing and font value comes from a token in `:root`. A
  component never hardcodes a colour, or the two themes drift apart.

## Content

- A post is a markdown file in `src/content/posts/`, named for its slug. The
  slug is never repeated in the frontmatter.
- Required frontmatter: `title`, `date` (`YYYY-MM-DD`). Optional: `description`,
  `tags`, `draft`.
- Posts stay as close to plain markdown as possible, so they remain readable and
  portable outside this site. Svelte in a post needs a reason.
- A malformed or incomplete post fails the build. Never render a placeholder.

## Performance

- The page is text. It should load like text: no webfont downloads, no
  client-side syntax highlighter, no framework work at runtime that the build
  could have done.
- Every third-party script is a decision recorded in `PLAN.md`, not a default.
- "This is faster" without a number is not an argument.

## Libraries

Libraries exist to save us work on topics we have deliberately chosen not to
spend time on. Using one is allowed only when we understand the topic it covers.

Before adopting any library, the agent provides a short reading pointer (spec,
docs, or reference implementation) for the underlying topic. Nils reads enough
to get the gist, then decides whether we still want the library. The decision
and its reason are recorded in `PLAN.md`.

### Tiers

**Tier 1 — plumbing, free to use:** the toolchain itself (pnpm, Vite,
SvelteKit, TypeScript, Vitest, ESLint, Prettier, Lightning CSS), and settled
format parsers where the format is large and boring: `mdsvex` for
CommonMark/GFM, `shiki` for syntax highlighting.

**Tier 2 — topic fundamentals, hand-written first:** the post index and its
sorting, the RSS and sitemap generators, date formatting, the theme switch, the
design tokens, reading-time and excerpt logic, pagination. The library version
may be adopted _after_ the hand-written one works, with a stated reason and a
one-line note in `PROGRESS.md` on what was learned.

**Tier 3 — not used:** CSS frameworks and component libraries (Tailwind,
Skeleton, Bits UI), state-management libraries, analytics and tracking scripts,
`date-fns`/`dayjs`, anything that ships JavaScript to render text.

**Anything not listed:** stop and ask Nils. Record the answer here.

## Testing

There is no test framework yet, and one is not added until something breaks that
a test would have caught. Until then the build is the test, and it must stay
strict:

- `npm run check` passes with zero errors and zero warnings. A warning that is
  genuinely wrong is silenced at the site with a comment saying why.
- `npm run build` is the real gate: prerendering resolves every internal link,
  so a broken link or a missing page fails the build.
- Never weaken a check to make it pass. Raise it with Nils.
- When tests do arrive: the unit under test is a subsystem (the post index, the
  feed), not a function. No mocks.

## Version control

- Commit often, in small steps, with the reason for the change in the message.
- Work happens on a branch per milestone. `main` is what is live.
- Deployment is only ever a push to `main`. Nothing is uploaded by hand.
- Never skip or disable a hook, and never push a workflow change that skips CI.

## Working agreement

- Nils comes from web, cloud and backend development. Backend instincts applied
  to the frontend get challenged with concrete reasons, not waved through.
- Push back on bad ideas. Say plainly when something is not known instead of
  inventing technical details.
- Ask rather than assume when a decision is Nils's to make.

## Learning tasks

Reading and research are tracked as their own GitHub issues, labelled
`learning`, not as side notes inside implementation issues. Each one names its
sources and ends in a note under `docs/notes/`, which is also where the decision
it feeds is recorded. A `learning` issue blocking a milestone is closed before
that milestone starts.
