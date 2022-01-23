<script lang="ts">
	import { onMount } from 'svelte';
	import Sentio from '../lib/sentio/sentio';
	import VideoBookmark from '../lib/sentio/videoBookmark';
	import { createEventDispatcher } from 'svelte';
	import VideoBaseItem from './VideoBaseItem.svelte';
	const dispatch = createEventDispatcher();

	export let video: VideoBookmark;
	export let hasControls = false;
	export let preventDefaultOnClick = false;
	let sentio: Sentio | null;
	let showScr: boolean;

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(w => {
			sentio = w.sentio ?? null;
		});

		showScr = sentio?.options.get('menu-show-video-src') ?? false;
	});

	function onclick() {
		if (!preventDefaultOnClick) openThis();

		dispatch('click', video.export?.());
	}
	function openThis() {
		browser.tabs.create({ url: video.baseUrl });
	}
	function deleteThis() {
		sentio?.videoBookmarks
			.delete(video.src)
			.finally(() => dispatch('reload-required'));
	}
</script>

<VideoBaseItem
	{video}
	{hasControls}
	{showScr}
	showBaseUrl={true}
	on:click={onclick}
	on:dblclick={openThis}
	on:click-play={openThis}
	on:click-delete={deleteThis}
/>
