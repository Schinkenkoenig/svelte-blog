<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '$lib/config';
</script>

<svelte:head>
	<title>About · {site.title}</title>
	<meta name="description" content="About {site.author}." />
</svelte:head>

<h1>About</h1>

<div class="prose">
	<p>
		I write software for the web, cloud and backends, and I am currently working my way down the
		stack &mdash; systems programming, game architecture the handmade way, and chess engines.
	</p>
	<p>This is where the notes end up. Mostly for me; you are welcome to read along.</p>
	<p>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		Find me on <a href={site.links[0].href}>GitHub</a>, or subscribe via
		<a href={resolve('/rss.xml')}>RSS</a>.
	</p>
</div>

<style>
	h1 {
		font-size: var(--font-title);
		margin-bottom: var(--space-6);
	}
</style>
