// mdsvex configuration: how a markdown post becomes a Svelte component.
//
// mdsvex is adopted deliberately (see PLAN.md): CommonMark plus GFM is a large,
// settled spec, and parsing it is not what this project set out to learn. What
// we do own is everything around it -- the post index, prerendering, feeds --
// which lives in src/lib.
//
// Syntax highlighting runs through Shiki at build time, so no highlighter ships
// to the browser. Shiki emits inline `style` attributes for both themes at once
// (CSS variables mode), which is what lets a post switch light/dark with the
// rest of the page and no flash.

import { createHighlighter } from 'shiki';

// Languages are listed explicitly rather than loaded on demand: the build is
// static, so an unknown language should fail loudly here, not silently render
// as plain text.
const LANGUAGES = [
	'bash',
	'c',
	'css',
	'diff',
	'go',
	'html',
	'javascript',
	'json',
	'markdown',
	'nix',
	'odin',
	'python',
	'rust',
	'svelte',
	'toml',
	'typescript',
	'yaml'
];

// Created on first use rather than on import. Loading two themes and every
// grammar costs ~150ms, and a build or a dev-server start with no code block in
// it should not pay that. The promise is cached, so the cost is paid once per
// process at most.
/** @type {Promise<import('shiki').Highlighter> | undefined} */
let pending;

function highlighter() {
	pending ??= createHighlighter({
		themes: ['github-light', 'github-dark-default'],
		langs: LANGUAGES
	});
	return pending;
}

// Shiki's HTML lands inside a Svelte component, where `{`, `}` and backticks are
// template syntax. They have to be neutralised or the compiler will try to read
// the code sample as Svelte.
const ESCAPES = { '{': '&#123;', '}': '&#125;', '`': '&#96;' };

/** @param {string} html */
function escape_svelte(html) {
	return html
		.replace(/[{}`]/g, (c) => ESCAPES[/** @type {keyof typeof ESCAPES} */ (c)])
		.replace(/\\([trn])/g, '&#92;$1');
}

/** @type {import('mdsvex').MdsvexOptions} */
export default {
	extensions: ['.md'],
	highlight: {
		async highlighter(code, lang) {
			// An unlisted or absent language renders as plain text rather than
			// failing the build: a fenced block with no language is legitimate.
			const language = lang && LANGUAGES.includes(lang) ? lang : 'text';
			const shiki = await highlighter();
			const html = shiki.codeToHtml(code, {
				lang: language,
				themes: { light: 'github-light', dark: 'github-dark-default' },
				defaultColor: false
			});
			// Shiki marks the <pre> focusable so a long sample can be scrolled with
			// the keyboard. Svelte's a11y pass flags any tabindex on a
			// non-interactive element, so the warning is waived here rather than
			// dropping the behaviour.
			return escape_svelte(
				`<!-- svelte-ignore a11y_no_noninteractive_tabindex -->\n<div class="code-block">${html}</div>`
			);
		}
	}
};
