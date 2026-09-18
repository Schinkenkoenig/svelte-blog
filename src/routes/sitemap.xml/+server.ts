// The sitemap, prerendered into a static sitemap.xml.

import { site } from '$lib/config';
import { renderSitemap } from '$lib/feed';
import { listPosts } from '$lib/content';

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	return new Response(renderSitemap(listPosts(), site.url), {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
