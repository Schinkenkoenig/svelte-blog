// The RSS feed, generated at build time into a static rss.xml.
//
// Written by hand rather than with a feed library: RSS 2.0 is a handful of
// elements, and the escaping is the only part that is easy to get wrong.

import { site } from '$lib/config';
import { listPosts } from '$lib/posts';

export const prerender = true;
// Pages use trailing slashes; a file called rss.xml must not gain one.
export const trailingSlash = 'never';

function escape(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

// RSS requires RFC 822 dates, which is not what the frontmatter holds.
function rfc822(iso: string): string {
	return new Date(`${iso}T00:00:00Z`).toUTCString();
}

export function GET() {
	const posts = listPosts();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escape(site.title)}</title>
		<description>${escape(site.description)}</description>
		<link>${site.url}/</link>
		<atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
		<language>${site.lang}</language>
${posts
	.map(
		(post) => `		<item>
			<title>${escape(post.title)}</title>
			<description>${escape(post.description)}</description>
			<link>${site.url}/posts/${post.slug}/</link>
			<guid isPermaLink="true">${site.url}/posts/${post.slug}/</guid>
			<pubDate>${rfc822(post.date)}</pubDate>
		</item>`
	)
	.join('\n')}
	</channel>
</rss>
`;

	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
