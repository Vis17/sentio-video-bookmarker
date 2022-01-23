<script lang="ts">
	import { onMount } from 'svelte';
	import Sentio from '../lib/sentio/sentio';
	import VideoBookmark, { type VideoData } from '../lib/sentio/videoBookmark';
	import VideoBookmarkItem from './VideoBookmarkItem.svelte';
	import VideoDataItem from './VideoDataItem.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let list:
		| { type: 'current-page-videos'; videos?: VideoData[] }
		| { type: 'video-bookmarks'; videos?: VideoBookmark[] };
	let sentio: Sentio | undefined;
	let notLoadedVideos = 0;

	/**
	 * Trigger a update run
	 * @param forced If true, run the update function, regardless of
	 * `page-auto-reload`-option. Defaults to `false`.
	 */
	export async function update(forced = false) {
		if (!sentio)
			sentio = (await browser.runtime.getBackgroundPage())?.sentio;
		if (!sentio?.options.get('page-auto-reload') && !forced) return;

		await sentio?.activePage.reloadVideos();
		list.videos =
			list.type === 'current-page-videos'
				? sentio?.activePage.videos ?? []
				: [...(sentio?.videoBookmarks.query({}) ?? [])];

		notLoadedVideos = sentio?.activePage.notLoadedVideos ?? 0;
	}

	onMount(() => {
		update(true);
	});
</script>

<section>
	<h2><slot name="title">Videos</slot></h2>

	<div class="c-videos">
		{#if list.type === 'current-page-videos'}
			{#each list.videos ?? [] as x}
				<VideoDataItem
					on:click={() => dispatch('reload-required')}
					video={x}
				/>
			{/each}
		{:else if list.type === 'video-bookmarks'}
			{#each list.videos ?? [] as x}
				<VideoBookmarkItem
					on:reload-required={() => dispatch('reload-required')}
					video={x}
				/>
			{/each}
		{/if}
	</div>

	{#if (!list.videos || list.videos.length === 0) && notLoadedVideos === 0}
		<div>
			<small>Nothing was found.</small>
		</div>
	{/if}

	{#if notLoadedVideos && list.type === 'current-page-videos'}
		<div class="not-loaded-videos">
			<span
				>{notLoadedVideos} video{notLoadedVideos === 1 ? '' : 's'} with unloaded
				metadata.<br /><small
					>Try to start the video to load the data.</small
				></span
			>
		</div>
	{/if}
</section>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.not-loaded-videos {
		text-align: center;
		padding-top: 1rem;
	}
</style>
