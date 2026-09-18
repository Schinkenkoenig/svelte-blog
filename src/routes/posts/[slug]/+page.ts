// Loads one post: its metadata from the index, its body as a Svelte component.
//
// The glob here is lazy, so each post is its own chunk rather than one bundle
// containing every post ever written.

import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { findPost, listPosts } from '$lib/posts';

const bodies = import.meta.glob<{ default: Component }>('/src/content/posts/*.md');

// Named explicitly rather than left to the crawler, so a post that is not
// linked from anywhere still gets a page.
export function entries() {
	return listPosts().map((post) => ({ slug: post.slug }));
}

export async function load({ params }) {
	const meta = findPost(params.slug);
	const body = bodies[`/src/content/posts/${params.slug}.md`];

	if (!meta || !body) error(404, `No post called "${params.slug}"`);

	return { meta, content: (await body()).default };
}
