<!-- The frame every page sits in: header, content column, footer. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { site } from '$lib/config';
	import '$lib/styles/app.css';

	let { children } = $props();

	// A nav item is current when the path is the item itself or lives under it.
	// The home link is exact, or it would light up on every page.
	//
	// Both sides go through resolve(), so the comparison happens on real URLs and
	// the base path cannot make it silently wrong.
	function isCurrent(href: (typeof site.nav)[number]['href']): boolean {
		const target = resolve(href);
		const path = page.url.pathname;
		return href === '/' ? path === target : path.startsWith(target);
	}
</script>

<a class="skip" href="#content">Skip to content</a>

<header>
	<div class="page bar">
		<a class="brand" href={resolve('/')}>{site.title}</a>
		<nav>
			{#each site.nav as item (item.href)}
				<a href={resolve(item.href)} aria-current={isCurrent(item.href) ? 'page' : undefined}>
					{item.label}
				</a>
			{/each}
			<ThemeToggle />
		</nav>
	</div>
</header>

<main id="content" class="page">
	{@render children()}
</main>

<footer>
	<div class="page bar">
		<span>&copy; {new Date().getFullYear()} {site.author}</span>
		<nav>
			{#each site.links as link (link.href)}
				<!-- Off-site URLs from config: resolve() is for this app's own routes,
					and there is nothing here for it to resolve. -->
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={link.href} rel="me noreferrer">{link.label}</a>
			{/each}
			<a href={resolve('/rss.xml')}>RSS</a>
		</nav>
	</div>
</footer>

<style>
	.skip {
		position: absolute;
		left: -9999px;
	}

	.skip:focus {
		left: var(--space-4);
		top: var(--space-4);
		z-index: 10;
		padding: var(--space-2) var(--space-3);
		background: var(--bg-subtle);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-md);
	}

	header {
		border-bottom: 1px solid var(--border);
		background: color-mix(in srgb, var(--bg) 85%, transparent);
		backdrop-filter: blur(8px);
		position: sticky;
		top: 0;
		z-index: 5;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--gap-block);
		min-height: var(--space-7);
	}

	.brand {
		font-weight: var(--weight-semibold);
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.brand:hover {
		color: var(--accent);
	}

	nav {
		display: flex;
		align-items: center;
		gap: var(--gap-inline);
		font-size: var(--font-ui);
	}

	nav a {
		color: var(--text-muted);
	}

	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--text);
	}

	nav a[aria-current='page'] {
		text-decoration: underline;
		text-underline-offset: 6px;
		text-decoration-color: var(--accent);
		text-decoration-thickness: 2px;
	}

	main {
		display: block;
		padding-block: var(--gap-section) var(--space-9);
		min-height: 60vh;
	}

	footer {
		border-top: 1px solid var(--border);
		color: var(--text-faint);
		font-size: var(--font-ui);
	}

	footer .bar {
		min-height: var(--space-8);
	}
</style>
