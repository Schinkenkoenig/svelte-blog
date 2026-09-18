<!--
	Light/dark switch.

	This component holds no state, on purpose. The `data-theme` attribute on
	<html> is the single source of truth: the inline script in app.html sets it
	before the first paint, CSS reads it to pick the palette, and this button
	flips it. Mirroring it into a `$state` would mean two sources that can
	disagree, plus an `$effect` to keep them in step -- which is the pattern
	AGENTS.md rules out.

	Which icon is shown is therefore also a CSS question, not a JavaScript one.
	Both are rendered and the theme selects one. That makes the button correct in
	the server-rendered HTML, before any JavaScript has run, with no hydration
	mismatch and no flash.
-->
<script lang="ts">
	function toggle() {
		const root = document.documentElement;
		const next = root.dataset.theme === 'light' ? 'dark' : 'light';
		root.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Private mode, or storage disabled. The page still works; the choice
			// just will not survive a reload.
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-label="Toggle light and dark theme"
	title="Toggle theme"
>
	<svg class="sun" viewBox="0 0 24 24" aria-hidden="true">
		<circle cx="12" cy="12" r="4.2" />
		<path
			d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"
		/>
	</svg>
	<svg class="moon" viewBox="0 0 24 24" aria-hidden="true">
		<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" />
	</svg>
</button>

<style>
	button {
		display: grid;
		place-items: center;
		width: var(--space-6);
		height: var(--space-6);
		padding: 0;
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		color: var(--text-muted);
		cursor: pointer;
		transition:
			color var(--transition),
			background var(--transition),
			border-color var(--transition);
	}

	button:hover {
		color: var(--accent);
		background: var(--accent-soft);
		border-color: var(--border);
	}

	svg {
		grid-area: 1 / 1;
		width: var(--space-4);
		height: var(--space-4);
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* Dark is the default, so the sun (meaning "switch to light") shows unless
	   the document says otherwise. */
	.moon {
		display: none;
	}

	:global(:root[data-theme='light']) .sun {
		display: none;
	}

	:global(:root[data-theme='light']) .moon {
		display: block;
	}
</style>
