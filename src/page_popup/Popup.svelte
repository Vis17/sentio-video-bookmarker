<script lang="ts">
	import { onMount } from 'svelte';
	import VideoDataItem from '../components/VideoDataItem.svelte';
	import Sentio from '../lib/sentio/sentio';
	import { type VideoData } from '../lib/sentio/videoBookmark';

	let sentio: Sentio | undefined;
	let videos: VideoData[] = [];
	let notLoadedVideos = 0;

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(w => {
			sentio = w.sentio;
		});
		videos = sentio?.activePage.videos ?? [];
		notLoadedVideos = sentio?.activePage.notLoadedVideos ?? 0;

		(async () => {
			if (!sentio?.options.get('page-auto-reload')) return;

			await sentio?.activePage.reloadVideos();
			videos = sentio?.activePage.videos ?? [];
			notLoadedVideos = sentio?.activePage.notLoadedVideos ?? 0;
		})();
	});
</script>

<div class="popup">
	<main>
		<h1>Bookmark Video</h1>

		<div class="c-videos">
			{#each videos as x}
				<VideoDataItem video={x} />
			{/each}
		</div>

		{#if notLoadedVideos}
			<div class="not-loaded-videos">
				<span
					>{notLoadedVideos} video{notLoadedVideos === 1 ? '' : 's'} with
					unloaded metadata.<br /><small
						>Try to start the video to load the data.</small
					></span
				>
			</div>
		{/if}
	</main>
</div>

<style lang="scss">
	@use '../scss/layout/popup';

	.not-loaded-videos {
		text-align: center;
		padding-top: 1rem;
	}
</style>
