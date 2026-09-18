// What a post is, and every operation on a list of them.
//
// Deliberately pure: no imports, no glob, no Vite. `content.ts` is what binds
// these functions to the actual markdown files. The split is what lets the unit
// tests run in milliseconds without a build -- importing this file cannot drag
// in a single .md.
//
// The slug is the filename. It is not stored in the frontmatter because two
// sources of truth for a URL is one too many.

export type PostMeta = {
	slug: string;
	title: string;
	description: string;
	/** ISO calendar day (YYYY-MM-DD). */
	date: string;
	tags: string[];
	draft: boolean;
};

/** The frontmatter a post file is expected to declare. */
export type Frontmatter = {
	title?: string;
	description?: string;
	/** YAML parses an unquoted `2026-09-18` into a Date, so both shapes arrive here. */
	date?: string | Date;
	tags?: string[];
	draft?: boolean;
};

/** `src/content/posts/hello.md` -> `hello`. */
export function slugOf(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

// A post is dated, not timestamped. Anything below day resolution is dropped
// rather than carried around as a timezone bug waiting to happen.
function toCalendarDay(date: string | Date): string {
	return date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10);
}

/**
 * Validates one post's frontmatter and normalises it into a `PostMeta`.
 *
 * Throws rather than falling back: a post missing a title is a mistake, and the
 * build is the right place to find out. Rendering "undefined" into a page would
 * hide it until it was published.
 */
export function parsePost(path: string, frontmatter: Frontmatter): PostMeta {
	if (!frontmatter.title) throw new Error(`${path}: frontmatter is missing "title"`);
	if (!frontmatter.date) throw new Error(`${path}: frontmatter is missing "date"`);

	const date = toCalendarDay(frontmatter.date);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`${path}: "date" must be YYYY-MM-DD, got "${String(frontmatter.date)}"`);
	}

	return {
		slug: slugOf(path),
		title: frontmatter.title,
		description: frontmatter.description ?? '',
		date,
		tags: frontmatter.tags ?? [],
		draft: frontmatter.draft ?? false
	};
}

/** Newest first. Ties break on slug so the order is stable across builds. */
export function sortPosts(posts: PostMeta[]): PostMeta[] {
	return [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/** Tags with their use counts, most used first, then alphabetical. */
export function countTags(posts: PostMeta[]): { tag: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Renders an ISO calendar day the way the site displays it. */
export function formatDate(iso: string, lang = 'en'): string {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
