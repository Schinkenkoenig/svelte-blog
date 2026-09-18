<script lang="ts">
	import { base } from '$app/paths';
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
		Find me on <a href="https://github.com/Schinkenkoenig">GitHub</a>, or subscribe via
		<a href="{base}/rss.xml">RSS</a>.
	</p>
</div>

<style>
	h1 {
		font-size: 1.9rem;
		margin-bottom: 2rem;
	}
</style>
