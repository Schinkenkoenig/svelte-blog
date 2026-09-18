// The post index.
//
// Posts are markdown files under src/content/posts. Vite's `import.meta.glob`
// resolves that pattern at build time, so the index is assembled during the
// build and shipped as data -- there is no filesystem read at runtime, which is
// what lets the whole site prerender.
//
// The slug is the filename. It is not stored in the frontmatter because two
// sources of truth for a URL is one too many.

export type PostMeta = {
	slug: string;
	title: string;
	description: string;
	/** ISO date (YYYY-MM-DD) from the frontmatter. */
	date: string;
	tags: string[];
	draft: boolean;
};

/** The frontmatter a post file is expected to declare. */
type Frontmatter = {
	title?: string;
	description?: string;
	/** YAML parses an unquoted `2026-09-18` into a Date, so both shapes arrive here. */
	date?: string | Date;
	tags?: string[];
	draft?: boolean;
};

const files = import.meta.glob<{ metadata: Frontmatter }>('/src/content/posts/*.md', {
	eager: true
});

function slug_of(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

// A post missing a title or date is a mistake, and a build is the right place to
// find out. Silently rendering "undefined" would hide it until it was published.
function to_meta(path: string, metadata: Frontmatter): PostMeta {
	const slug = slug_of(path);

	if (!metadata.title) throw new Error(`${path}: frontmatter is missing "title"`);
	if (!metadata.date) throw new Error(`${path}: frontmatter is missing "date"`);

	// Normalise both shapes to a plain calendar day. A post is dated, not
	// timestamped, so anything below day resolution is dropped rather than
	// carried around as a timezone bug waiting to happen.
	const date =
		metadata.date instanceof Date
			? metadata.date.toISOString().slice(0, 10)
			: String(metadata.date).slice(0, 10);

	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`${path}: "date" must be YYYY-MM-DD, got "${String(metadata.date)}"`);
	}

	return {
		slug,
		title: metadata.title,
		description: metadata.description ?? '',
		date,
		tags: metadata.tags ?? [],
		draft: metadata.draft ?? false
	};
}

// Drafts are visible while writing and absent from the build, so an unfinished
// post can live on the branch without a separate staging deploy.
const all = Object.entries(files)
	.map(([path, module]) => to_meta(path, module.metadata))
	.filter((post) => import.meta.env.DEV || !post.draft)
	.sort((a, b) => b.date.localeCompare(a.date));

export function listPosts(): PostMeta[] {
	return all;
}

export function findPost(slug: string): PostMeta | undefined {
	return all.find((post) => post.slug === slug);
}

export function listTags(): { tag: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const post of all) {
		for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Renders an ISO date the way the site displays it. */
export function formatDate(iso: string, lang = 'en'): string {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
