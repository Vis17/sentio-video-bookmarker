<script lang="ts">
	const version = browser.runtime.getManifest().version ?? '-';
</script>

<svelte:head>
	<title>About | Sentio - Video-Bookmarker</title>
</svelte:head>

<div class="wrapper">
	<article>
		<h1>About Sentio - Video-Bookmarker</h1>

		<section>
			<h2>Version</h2>
			<p><b>{version}</b></p>
		</section>

		<hr />

		<section>
			<h2>Open Source</h2>
			<p>
				This project can be found on <a
					href="https://github.com/tametsi/sentio-video-bookmarker"
					target="_blank">GitHub</a
				>.
			</p>
		</section>

		<hr />

		<section>
			<h2>Libraries</h2>
			<p>This project is just possible through open source software ❤</p>
			<ul>
				<li>
					<a href="https://svelte.dev/" target="_blank">Svelte</a> and
					<a href="https://sass-lang.com/" target="_blank">Sass</a> are
					used for the UI
				</li>
				<li>
					<a href="https://webpack.js.org/" target="_blank">webpack</a
					> is used to bundle the files
				</li>
				<li>
					<a href="https://jestjs.io/" target="_blank">Jest</a> is used
					for the few tests
				</li>
			</ul>
		</section>
	</article>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.wrapper {
		padding: 1rem;

		section {
			padding: 2rem 0;
		}

		hr {
			width: 20%;
			color: a.$copper-rose;
		}
	}
</style>
