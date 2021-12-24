<script lang="ts">
	import { onMount } from 'svelte';
	import Sentio from '../lib/sentio/sentio';
	import { type VideoData } from '../lib/sentio/videoBookmark';
	import VideoItem from '../components/VideoItem.svelte';

	let sentio: Sentio | undefined;
	let videos: VideoData[] = [];

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(w => {
			sentio = w.sentio;
		});
		videos = sentio?.activePage.videos ?? [];

		(async () => {
			if (!sentio?.options.get('page-auto-reload')) return;

			await sentio?.activePage.reloadVideos();
			videos = sentio?.activePage.videos ?? [];
		})();
	});
</script>

<div class="popup">
	<main>
		<h1>Bookmark Video</h1>

		<div class="c-videos">
			{#each videos as x}
				<VideoItem video={{ videoData: x }} />
			{/each}
		</div>
	</main>
</div>

<style lang="scss">
	@use '../scss/layout/popup';
</style>
