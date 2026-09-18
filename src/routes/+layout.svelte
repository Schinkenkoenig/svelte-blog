<!-- The frame every page sits in: header, content column, footer. -->
<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { site } from '$lib/config';
	import '$lib/styles/app.css';

	let { children } = $props();

	// A nav item is current when the path is the item itself or lives under it.
	// The home link is exact, or it would light up on every page.
	function isCurrent(href: string): boolean {
		const path = page.url.pathname.replace(base, '') || '/';
		return href === '/' ? path === '/' : path.startsWith(href);
	}
</script>

<a class="skip" href="#content">Skip to content</a>

<header>
	<div class="page bar">
		<a class="brand" href="{base}/">{site.title}</a>
		<nav>
			{#each site.nav as item (item.href)}
				<a href="{base}{item.href}" aria-current={isCurrent(item.href) ? 'page' : undefined}>
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
				<a href={link.href} rel="me noreferrer">{link.label}</a>
			{/each}
			<a href="{base}/rss.xml">RSS</a>
		</nav>
	</div>
</footer>

<style>
	.skip {
		position: absolute;
		left: -9999px;
	}

	.skip:focus {
		left: 1rem;
		top: 1rem;
		z-index: 10;
		padding: 0.5rem 0.75rem;
		background: var(--bg-subtle);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius);
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
		gap: 1rem;
		min-height: 3.5rem;
	}

	.brand {
		font-weight: 620;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.brand:hover {
		color: var(--accent);
	}

	nav {
		display: flex;
		align-items: center;
		gap: 1.1rem;
		font-size: 0.925rem;
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
		padding-block: 3rem 5rem;
		min-height: 60vh;
	}

	footer {
		border-top: 1px solid var(--border);
		color: var(--text-faint);
		font-size: 0.875rem;
	}

	footer .bar {
		min-height: 4rem;
	}
</style>
