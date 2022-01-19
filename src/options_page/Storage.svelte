<script lang="ts">
	import Sentio from '../lib/sentio/sentio';

	let sentio: Sentio | undefined;

	browser.runtime.getBackgroundPage().then(w => {
		sentio = w?.sentio;
	});

	/** Clears the extension storage. _(Prompts user first via `confirm()`)_ */
	function clear() {
		if (
			!confirm(
				'Do you really want to clear the extension´s storage? This will not only clear all saved Options, but also all Video-Bookmarks.\nThis action cannot be undone.'
			)
		)
			return;

		sentio?.clear();
	}
</script>

<svelte:head>
	<title>Storage | Sentio - Video-Bookmarker</title>
</svelte:head>

<div class="wrapper">
	<article>
		<h1>Manage Storage</h1>

		<section>
			<h2>Clear local storage</h2>
			<p>
				This will clear the local storage of the extension. All
				Video-Bookmarks and Options will be reset.
			</p>
			<button class="warning" on:click={clear}>Clear</button>
		</section>
	</article>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.wrapper {
		padding: 1rem;
	}
</style>
