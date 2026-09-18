// Binds the post functions to the actual markdown files.
//
// `import.meta.glob` is resolved by Vite at build time, so the index is
// assembled during the build and shipped as data. Nothing reads the filesystem
// at runtime, because there is no runtime.
//
// This is the only module that knows where posts live on disk. Everything else
// goes through the pure functions in posts.ts.

import { countTags, parsePost, sortPosts, type Frontmatter, type PostMeta } from './posts';

const files = import.meta.glob<{ metadata: Frontmatter }>('/src/content/posts/*.md', {
	eager: true
});

// Drafts are visible while writing and absent from the build, so an unfinished
// post can live on a branch without a separate staging deploy.
const all = sortPosts(
	Object.entries(files)
		.map(([path, module]) => parsePost(path, module.metadata))
		.filter((post) => import.meta.env.DEV || !post.draft)
);

export function listPosts(): PostMeta[] {
	return all;
}

export function findPost(slug: string): PostMeta | undefined {
	return all.find((post) => post.slug === slug);
}

export function listTags(): { tag: string; count: number }[] {
	return countTags(all);
}
