// Everything about this blog that is not content or layout.
//
// `url` is the canonical origin, used for the absolute links that feeds and
// sitemaps require. It has no trailing slash; callers add one.

export const site = {
	title: 'Nils',
	description: 'Notes on systems programming, chess engines, and whatever else is being learned.',
	url: 'https://schinkenkoenig.github.io/svelte-blog',
	author: 'Nils',
	lang: 'en',
	nav: [
		{ href: '/', label: 'Writing' },
		{ href: '/about', label: 'About' }
	],
	links: [{ href: 'https://github.com/Schinkenkoenig', label: 'GitHub' }]
} as const;
