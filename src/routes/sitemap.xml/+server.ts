// A sitemap of every prerendered page, so search engines do not have to guess.

import { site } from '$lib/config';
import { listPosts } from '$lib/posts';

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	const urls = [
		{ loc: `${site.url}/`, lastmod: undefined as string | undefined },
		{ loc: `${site.url}/about/`, lastmod: undefined as string | undefined },
		...listPosts().map((post) => ({
			loc: `${site.url}/posts/${post.slug}/`,
			lastmod: post.date
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		({ loc, lastmod }) =>
			`	<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
