<!-- Home: a short introduction and the reverse-chronological post list. -->
<script lang="ts">
	import { base } from '$app/paths';
	import { site } from '$lib/config';
	import { formatDate, listPosts } from '$lib/posts';

	const posts = listPosts();
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<section class="intro">
	<h1>{site.title}</h1>
	<p>{site.description}</p>
</section>

<ul class="posts">
	{#each posts as post (post.slug)}
		<li>
			<a href="{base}/posts/{post.slug}">
				<time datetime={post.date}>{formatDate(post.date, site.lang)}</time>
				<h2>{post.title}{#if post.draft}<span class="draft">draft</span>{/if}</h2>
				{#if post.description}<p>{post.description}</p>{/if}
			</a>
		</li>
	{:else}
		<li class="empty">Nothing published yet.</li>
	{/each}
</ul>

<style>
	.intro {
		margin-bottom: 3.5rem;
	}

	.intro h1 {
		font-size: 1.75rem;
		margin-bottom: 0.6rem;
	}

	.intro p {
		margin: 0;
		color: var(--text-muted);
		max-width: var(--measure);
	}

	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.posts a {
		display: block;
		padding: 1rem;
		margin-inline: -1rem;
		border-radius: var(--radius);
		color: inherit;
		transition: background var(--transition);
	}

	.posts a:hover {
		background: var(--bg-subtle);
	}

	time {
		display: block;
		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
		color: var(--text-faint);
		letter-spacing: 0.02em;
	}

	.posts h2 {
		font-size: 1.075rem;
		margin-top: 0.2rem;
	}

	.posts a:hover h2 {
		color: var(--accent);
	}

	.posts p {
		margin: 0.3rem 0 0;
		color: var(--text-muted);
		font-size: 0.925rem;
		max-width: var(--measure);
	}

	.draft {
		margin-left: 0.5rem;
		padding: 0.1em 0.45em;
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--accent);
		background: var(--accent-soft);
		border-radius: 4px;
		vertical-align: middle;
	}

	.empty {
		color: var(--text-faint);
	}
</style>
