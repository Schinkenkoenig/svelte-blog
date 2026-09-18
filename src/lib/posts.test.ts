// Tests for the post index: the frontmatter contract, and the orderings the
// site depends on.

import { describe, expect, it } from 'vitest';
import { countTags, formatDate, parsePost, slugOf, sortPosts, type PostMeta } from './posts';

function post(overrides: Partial<PostMeta> = {}): PostMeta {
	return {
		slug: 'a',
		title: 'A',
		description: '',
		date: '2026-01-01',
		tags: [],
		draft: false,
		...overrides
	};
}

describe('slugOf', () => {
	it('takes the filename without its extension', () => {
		expect(slugOf('/src/content/posts/hello-world.md')).toBe('hello-world');
	});
});

describe('parsePost', () => {
	it('fills in the optional fields', () => {
		expect(parsePost('/p/x.md', { title: 'T', date: '2026-09-18' })).toEqual({
			slug: 'x',
			title: 'T',
			description: '',
			date: '2026-09-18',
			tags: [],
			draft: false
		});
	});

	// YAML turns an unquoted date into a Date. Both shapes have to land on the
	// same calendar day, or a post's URL and its displayed date disagree.
	it('accepts a Date from YAML and a string alike', () => {
		const fromYaml = parsePost('/p/x.md', { title: 'T', date: new Date('2026-09-18T00:00:00Z') });
		const fromString = parsePost('/p/x.md', { title: 'T', date: '2026-09-18' });
		expect(fromYaml.date).toBe('2026-09-18');
		expect(fromString.date).toBe(fromYaml.date);
	});

	it('names the file and the field when frontmatter is incomplete', () => {
		expect(() => parsePost('/p/x.md', { date: '2026-09-18' })).toThrow(/x\.md.*"title"/);
		expect(() => parsePost('/p/x.md', { title: 'T' })).toThrow(/x\.md.*"date"/);
	});

	it('rejects a date that is not a calendar day', () => {
		expect(() => parsePost('/p/x.md', { title: 'T', date: '18-09-2026' })).toThrow(/YYYY-MM-DD/);
	});
});

describe('sortPosts', () => {
	it('puts the newest first', () => {
		const sorted = sortPosts([
			post({ slug: 'old', date: '2025-01-01' }),
			post({ slug: 'new', date: '2026-01-01' })
		]);
		expect(sorted.map((p) => p.slug)).toEqual(['new', 'old']);
	});

	// Two posts on one day must not swap places between builds, or every build
	// produces a different feed.
	it('breaks ties on slug so the order is stable', () => {
		const same = [post({ slug: 'b' }), post({ slug: 'a' })];
		expect(sortPosts(same).map((p) => p.slug)).toEqual(['a', 'b']);
		expect(sortPosts([...same].reverse()).map((p) => p.slug)).toEqual(['a', 'b']);
	});

	it('does not mutate its argument', () => {
		const input = [
			post({ slug: 'a', date: '2025-01-01' }),
			post({ slug: 'b', date: '2026-01-01' })
		];
		sortPosts(input);
		expect(input.map((p) => p.slug)).toEqual(['a', 'b']);
	});
});

describe('countTags', () => {
	it('counts uses, most used first, then alphabetical', () => {
		expect(
			countTags([
				post({ tags: ['svelte', 'chess'] }),
				post({ tags: ['svelte'] }),
				post({ tags: ['odin'] })
			])
		).toEqual([
			{ tag: 'svelte', count: 2 },
			{ tag: 'chess', count: 1 },
			{ tag: 'odin', count: 1 }
		]);
	});

	it('is empty when nothing is tagged', () => {
		expect(countTags([post()])).toEqual([]);
	});
});

describe('formatDate', () => {
	// The date is a calendar day, not an instant. Parsing it as local time shifts
	// it a day backwards for anyone west of UTC.
	it('does not shift the day across timezones', () => {
		expect(formatDate('2026-01-01')).toBe('January 1, 2026');
	});
});
