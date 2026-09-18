<!-- Home: a short introduction and the reverse-chronological post list. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '$lib/config';
	import { listPosts } from '$lib/content';
	import { formatDate } from '$lib/posts';

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
			<a href={resolve('/posts/[slug]', { slug: post.slug })}>
				<time datetime={post.date}>{formatDate(post.date, site.lang)}</time>
				<h2>
					{post.title}{#if post.draft}<span class="draft">draft</span>{/if}
				</h2>
				{#if post.description}<p>{post.description}</p>{/if}
			</a>
		</li>
	{:else}
		<li class="empty">Nothing published yet.</li>
	{/each}
</ul>

<style>
	.intro {
		margin-bottom: var(--gap-section);
	}

	.intro h1 {
		font-size: var(--font-title);
		margin-bottom: var(--space-3);
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
		gap: var(--space-1);
	}

	.posts a {
		display: block;
		padding: var(--space-4);
		margin-inline: calc(-1 * var(--space-4));
		border-radius: var(--radius-md);
		color: inherit;
		transition: background var(--transition);
	}

	.posts a:hover {
		background: var(--bg-subtle);
	}

	time {
		display: block;
		font-size: var(--font-meta);
		font-variant-numeric: tabular-nums;
		color: var(--text-faint);
		letter-spacing: 0.02em;
	}

	.posts h2 {
		font-size: var(--font-subheading);
		margin-top: var(--space-1);
	}

	.posts a:hover h2 {
		color: var(--accent);
	}

	.posts p {
		margin: var(--space-1) 0 0;
		color: var(--text-muted);
		font-size: var(--font-ui);
		max-width: var(--measure);
	}

	.draft {
		margin-left: var(--space-2);
		padding: 0.1em 0.45em;
		font-size: var(--font-meta);
		font-weight: var(--weight-medium);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--accent);
		background: var(--accent-soft);
		border-radius: var(--radius-sm);
		vertical-align: middle;
	}

	.empty {
		color: var(--text-faint);
	}
</style>
