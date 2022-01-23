<script lang="ts">
	import { onMount } from 'svelte';
	import Sentio from '../lib/sentio/sentio';
	import { type VideoData } from '../lib/sentio/videoBookmark';
	import { createEventDispatcher } from 'svelte';
	import VideoBaseItem from './VideoBaseItem.svelte';
	const dispatch = createEventDispatcher();

	export let video: VideoData;
	export let preventDefaultOnClick = false;
	let sentio: Sentio | null;
	let showScr: boolean;

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(w => {
			sentio = w.sentio ?? null;
		});

		showScr = sentio?.options.get('menu-show-video-src') ?? false;
	});

	async function onclick() {
		if (!preventDefaultOnClick) await sentio?.videoBookmarks.toggle(video);

		dispatch('click', video);
	}
</script>

<VideoBaseItem {video} {showScr} showBaseUrl={false} on:click={onclick} />
