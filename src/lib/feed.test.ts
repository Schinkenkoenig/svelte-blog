// Tests for the feed generators. The interesting parts are the two places a
// hand-written serialiser goes wrong: escaping, and date formats.

import { describe, expect, it } from 'vitest';
import { escapeXml, renderRss, renderSitemap, rfc822 } from './feed';
import type { PostMeta } from './posts';

const channel = {
	title: 'Blog & Co',
	description: 'Notes',
	url: 'https://example.com/blog',
	lang: 'en'
};

const posts: PostMeta[] = [
	{
		slug: 'first',
		title: 'Bits & <pieces>',
		description: 'A "quoted" line',
		date: '2026-09-18',
		tags: ['meta'],
		draft: false
	}
];

describe('escapeXml', () => {
	it('escapes every character XML gives meaning to', () => {
		expect(escapeXml(`& < > " '`)).toBe('&amp; &lt; &gt; &quot; &apos;');
	});

	// Escaping & last would turn `&lt;` into `&amp;lt;`.
	it('does not double-escape an ampersand it just produced', () => {
		expect(escapeXml('<')).toBe('&lt;');
		expect(escapeXml('&amp;')).toBe('&amp;amp;');
	});
});

describe('rfc822', () => {
	it('renders a calendar day as an RFC 822 date in UTC', () => {
		expect(rfc822('2026-09-18')).toBe('Fri, 18 Sep 2026 00:00:00 GMT');
	});
});

describe('renderRss', () => {
	const xml = renderRss(posts, channel);

	it('escapes titles and descriptions in items and in the channel', () => {
		expect(xml).toContain('<title>Bits &amp; &lt;pieces&gt;</title>');
		expect(xml).toContain('<description>A &quot;quoted&quot; line</description>');
		expect(xml).toContain('<title>Blog &amp; Co</title>');
	});

	// A reader dedupes on guid. If it does not match the link the post shows up
	// twice, which is the classic hand-rolled-feed bug.
	it('uses the post URL as both link and guid, with a trailing slash', () => {
		expect(xml).toContain('<link>https://example.com/blog/posts/first/</link>');
		expect(xml).toContain('<guid isPermaLink="true">https://example.com/blog/posts/first/</guid>');
	});

	it('points atom:link at itself', () => {
		expect(xml).toContain('href="https://example.com/blog/rss.xml"');
	});

	it('produces a valid document with no posts', () => {
		const empty = renderRss([], channel);
		expect(empty).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(empty).not.toContain('<item>');
	});
});

describe('renderSitemap', () => {
	const xml = renderSitemap(posts, 'https://example.com/blog');

	it('lists the static pages and every post', () => {
		expect(xml).toContain('<loc>https://example.com/blog/</loc>');
		expect(xml).toContain('<loc>https://example.com/blog/about/</loc>');
		expect(xml).toContain('<loc>https://example.com/blog/posts/first/</loc>');
	});

	it('carries lastmod for posts and omits it where there is nothing to report', () => {
		expect(xml).toContain('<lastmod>2026-09-18</lastmod>');
		expect(xml).toContain('<url><loc>https://example.com/blog/</loc></url>');
	});
});
