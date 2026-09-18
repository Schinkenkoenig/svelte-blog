// The RSS feed, prerendered into a static rss.xml. The generator lives in
// src/lib/feed.ts; this is the binding to a route.

import { site } from '$lib/config';
import { renderRss } from '$lib/feed';
import { listPosts } from '$lib/content';

export const prerender = true;
// Pages use trailing slashes; a file called rss.xml must not gain one.
export const trailingSlash = 'never';

export function GET() {
	return new Response(renderRss(listPosts(), site), {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
