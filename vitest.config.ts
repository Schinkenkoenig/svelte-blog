// Test configuration, deliberately separate from vite.config.ts.
//
// The tests cover the pure functions in src/lib -- the post index, the feed
// generators. None of them needs a Svelte component compiled, a route resolved
// or a browser emulated, so the SvelteKit plugin is left out entirely and the
// `$lib` alias is declared by hand. That keeps a run in the tens of
// milliseconds, which is the difference between tests you run and tests you
// eventually stop running.
//
// If a test ever genuinely needs a rendered component, that is the moment to
// add a second project here -- not a reason to slow this one down.

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	},
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node'
	}
});
