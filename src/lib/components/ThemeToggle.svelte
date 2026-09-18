<!--
	Light/dark switch.

	The choice is written to localStorage and read back by the inline script in
	app.html on the next page load. The DOM attribute is the single source of
	truth while the page is open, so this component holds no state that could
	disagree with what is on screen.
-->
<script lang="ts">
	let theme = $state<'dark' | 'light'>('dark');

	$effect(() => {
		theme = (document.documentElement.dataset.theme as 'dark' | 'light') ?? 'dark';
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// Private mode, or storage disabled. The page still works; the choice
			// just will not survive a reload.
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-label="Switch to {theme === 'dark' ? 'light' : 'dark'} theme"
	title="Switch to {theme === 'dark' ? 'light' : 'dark'} theme"
>
	{#if theme === 'dark'}
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="12" cy="12" r="4.2" />
			<path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" />
		</svg>
	{/if}
</button>

<style>
	button {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius);
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
		width: 1.05rem;
		height: 1.05rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
