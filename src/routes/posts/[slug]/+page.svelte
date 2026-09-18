<!-- A single post: title block, then the rendered markdown. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '$lib/config';
	import { formatDate } from '$lib/posts';

	let { data } = $props();
	const Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title} · {site.title}</title>
	<meta name="description" content={data.meta.description || site.description} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description || site.description} />
	<meta property="article:published_time" content={data.meta.date} />
</svelte:head>

<article>
	<header>
		<time datetime={data.meta.date}>{formatDate(data.meta.date, site.lang)}</time>
		<h1>{data.meta.title}</h1>
		{#if data.meta.tags.length}
			<ul class="tags">
				{#each data.meta.tags as tag (tag)}
					<li>{tag}</li>
				{/each}
			</ul>
		{/if}
	</header>

	<div class="prose">
		<Content />
	</div>
</article>

<nav class="back">
	<a href={resolve('/')}>&larr; All writing</a>
</nav>

<style>
	header {
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-5);
		border-bottom: 1px solid var(--border);
	}

	time {
		font-size: var(--font-meta);
		font-variant-numeric: tabular-nums;
		color: var(--text-faint);
		letter-spacing: 0.02em;
	}

	h1 {
		font-size: var(--font-title);
		margin-top: var(--space-2);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		list-style: none;
		margin: var(--space-4) 0 0;
		padding: 0;
	}

	.tags li {
		font-size: var(--font-meta);
		color: var(--text-muted);
		padding: 0.15em 0.55em;
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
	}

	.back {
		margin-top: var(--space-8);
		padding-top: var(--space-5);
		border-top: 1px solid var(--border);
		font-size: var(--font-ui);
	}
</style>
