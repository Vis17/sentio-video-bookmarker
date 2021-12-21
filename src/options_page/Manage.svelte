<script lang="ts">
	//#region imports
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import VideoItem from '../components/VideoItem.svelte';
	import Sentio from '../lib/sentio/sentio';
	import VideoBookmark from '../lib/sentio/videoBookmark';
	//#endregion

	let videoBookmarks: VideoBookmark[] = [];
	let sentio: Sentio | undefined;

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(w => {
			sentio = w.sentio;
		});
		videoBookmarks = [...(sentio?.videoBookmarks.query({}) ?? [])];
	});

	function reload() {
		videoBookmarks = [...(sentio?.videoBookmarks.query({}) ?? [])];
	}

	function deleteAll() {
		if (
			!confirm(
				'Do you really want to delete all Video-Bookmarks?\nThey will be lost in the universe forever...'
			)
		)
			return;
		sentio?.videoBookmarks.deleteAll();
		reload();
	}
</script>

<div class="wrapper">
	<h1>Manage Video-Bookmarks</h1>

	<div class="c-controls">
		<button on:click={reload}>Reload</button>
		<button on:click={deleteAll} class="warning">Delete All</button>
	</div>

	<div class="c-video-bookmarks">
		{#each videoBookmarks as x (x.src)}
			<div animate:flip={{ duration: 300 }}>
				<VideoItem
					video={{ videoBookmark: x }}
					hasControls={true}
					defaultClickAction={false}
					on:reload-required={reload}
				/>
			</div>
		{:else}
			<p>No Video-Bookmarks yet.</p>
		{/each}
	</div>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.wrapper {
		padding: 1rem;
	}
	.c-controls {
		@include a.flex-container(row);
	}

	.c-video-bookmarks {
		padding: 1rem;
	}
</style>
