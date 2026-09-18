// ESLint: correctness only.
//
// The division of labour is deliberate. Prettier owns everything about how the
// code looks and is not negotiated with. ESLint owns only what Prettier cannot
// see -- unused variables, undefined globals, a Svelte component doing
// something the compiler will not catch. `eslint-config-prettier` comes last
// and switches off every stylistic rule, so the two can never disagree.
//
// No style rules are added here on purpose. A lint error should always mean
// "this is probably a bug", never "this is not how I would have written it" --
// otherwise the warnings become noise and get ignored, which costs the real
// findings too.

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	// The non-type-checked preset: it needs no TypeScript program, so linting
	// stays fast. `svelte-check` already does the type-aware pass.
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,

	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},

	{
		files: ['**/*.svelte', '**/*.svelte.ts'],
		languageOptions: {
			parserOptions: { parser: ts.parser }
		}
	},

	{
		rules: {
			// An unused argument is often a signature being honoured rather than a
			// mistake. Prefixing with _ is the opt-out.
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			]
		}
	},

	{
		ignores: ['build/', '.svelte-kit/', 'node_modules/', 'pnpm-lock.yaml']
	}
);
