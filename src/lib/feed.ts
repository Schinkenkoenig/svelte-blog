// RSS and sitemap generation.
//
// Pure functions: posts and a site origin in, a string out. The route handlers
// in src/routes are a two-line wrapper around these, which is what makes the
// escaping and date formatting testable without going through a build.
//
// Written by hand rather than with a feed library (Tier 2 in AGENTS.md). RSS 2.0
// is a handful of elements, and the escaping is the only part that is easy to
// get wrong.

import type { PostMeta } from './posts';

/** Escapes text for XML character data and attribute values. */
export function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** RSS requires RFC 822 dates, which is not what the frontmatter holds. */
export function rfc822(iso: string): string {
	return new Date(`${iso}T00:00:00Z`).toUTCString();
}

type Channel = {
	title: string;
	description: string;
	/** Canonical origin, no trailing slash. */
	url: string;
	lang: string;
};

export function renderRss(posts: PostMeta[], channel: Channel): string {
	const items = posts
		.map(
			(post) => `		<item>
			<title>${escapeXml(post.title)}</title>
			<description>${escapeXml(post.description)}</description>
			<link>${channel.url}/posts/${post.slug}/</link>
			<guid isPermaLink="true">${channel.url}/posts/${post.slug}/</guid>
			<pubDate>${rfc822(post.date)}</pubDate>
		</item>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(channel.title)}</title>
		<description>${escapeXml(channel.description)}</description>
		<link>${channel.url}/</link>
		<atom:link href="${channel.url}/rss.xml" rel="self" type="application/rss+xml" />
		<language>${channel.lang}</language>
${items}
	</channel>
</rss>
`;
}

export function renderSitemap(posts: PostMeta[], origin: string): string {
	const urls = [
		{ loc: `${origin}/`, lastmod: undefined as string | undefined },
		{ loc: `${origin}/about/`, lastmod: undefined as string | undefined },
		...posts.map((post) => ({ loc: `${origin}/posts/${post.slug}/`, lastmod: post.date }))
	];

	const entries = urls
		.map(
			({ loc, lastmod }) =>
				`	<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}
