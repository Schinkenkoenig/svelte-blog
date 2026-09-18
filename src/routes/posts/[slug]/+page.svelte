<!-- A single post: title block, then the rendered markdown. -->
<script lang="ts">
	import { base } from '$app/paths';
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
	<a href="{base}/">&larr; All writing</a>
</nav>

<style>
	header {
		margin-bottom: 2.75rem;
		padding-bottom: 1.75rem;
		border-bottom: 1px solid var(--border);
	}

	time {
		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
		color: var(--text-faint);
		letter-spacing: 0.02em;
	}

	h1 {
		font-size: 1.9rem;
		margin-top: 0.4rem;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
	}

	.tags li {
		font-size: 0.75rem;
		color: var(--text-muted);
		padding: 0.15em 0.55em;
		border: 1px solid var(--border);
		border-radius: 999px;
	}

	.back {
		margin-top: 4rem;
		padding-top: 1.75rem;
		border-top: 1px solid var(--border);
		font-size: 0.925rem;
	}
</style>
