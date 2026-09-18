// Build configuration. In current SvelteKit there is no separate
// svelte.config.js: SvelteKit's own options and vite-plugin-svelte's options are
// both passed to the `sveltekit()` plugin, which splits them apart.

import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import mdsvexConfig from './mdsvex.config.js';

// The browser targets come from the `browserslist` field in package.json, so
// there is one answer to "which browsers" that both Vite and Lightning CSS read.
const targets = browserslistToTargets(browserslist());

export default defineConfig({
	css: {
		// Lightning CSS instead of PostCSS: it is a Rust parser, it minifies
		// better, and -- the actual reason it is here -- it downlevels modern
		// colour syntax. tokens.css is written in oklch with color-mix(), and
		// this is what emits fallbacks for anything in `browserslist` that cannot
		// read them, so the palette can be authored in the good syntax without
		// betting the site on it.
		transformer: 'lightningcss',
		lightningcss: { targets }
	},

	build: {
		cssMinify: 'lightningcss'
	},

	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// `.md` is a first-class component extension, so posts can be imported
			// and rendered like any other Svelte component.
			extensions: ['.svelte', '.md'],
			preprocess: [mdsvex(mdsvexConfig)],

			// adapter-static prerenders every route to plain files. GitHub Pages
			// serves those files directly; there is no server at runtime.
			adapter: adapter({
				// A 404.html at the root is what GitHub Pages serves for any unknown
				// path, which gives us a styled not-found page instead of theirs.
				fallback: '404.html'
			}),

			// A project page lives at https://<user>.github.io/<repo>, so every
			// absolute URL needs that prefix. The workflow sets BASE_PATH; local
			// development runs at the root.
			paths: {
				base: (process.env.BASE_PATH ?? '') as '' | `/${string}`
			}
		})
	]
});
