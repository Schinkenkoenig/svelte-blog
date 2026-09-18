// Prerender everything. The site is a set of files on GitHub Pages; there is no
// runtime, so any route that cannot be prerendered is a build error -- which is
// the feedback we want.
export const prerender = true;

// GitHub Pages resolves /posts/foo/ to /posts/foo/index.html but does not
// rewrite /posts/foo. Always-trailing-slash makes the adapter emit directories
// with index.html, so both the crawler and Pages agree on where a page lives.
export const trailingSlash = 'always';
