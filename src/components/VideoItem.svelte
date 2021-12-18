<script lang="ts">
	import { onMount } from 'svelte';
	import { format } from '../lib/puncto';
	import Sentio from '../lib/sentio/sentio';
	import VideoBookmark, { type VideoData } from '../lib/sentio/videoBookmark';

	export let video:
		| { videoBookmark: VideoBookmark; videoData?: never }
		| { videoData: VideoData; videoBookmark?: never }
		| null;
	let sentio: Sentio | null;
	let bookmark: boolean;
	let showScr: boolean;

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(win => {
			sentio = win.sentio ?? null;
		});

		bookmark = !!video?.videoBookmark;
		showScr = sentio?.options.get('menu-show-video-src') ?? false;
	});

	function onClick() {
		if (video?.videoBookmark)
			return browser.tabs.create({ url: video.videoBookmark.baseUrl });

		if (video?.videoData)
			return sentio?.videoBookmarks.create(video.videoData);
	}
</script>

<div class="c-video" on:click={onClick}>
	<h2 class="text-overflow">
		{video?.videoBookmark?.title ?? video?.videoData?.title}
	</h2>
	<div class="c-infos">
		<!-- is bookmark? => show base-url -->
		{#if bookmark}
			<span
				class="info-item url text-overflow"
				title={video?.videoBookmark?.baseUrl ??
					video?.videoData?.baseUrl}
			>
				{video?.videoBookmark?.baseUrl ?? video?.videoData?.baseUrl}
			</span>
		{/if}
		<!-- show src-attribute? -->
		{#if showScr}
			<span
				class="info-item src text-overflow"
				title={video?.videoBookmark?.src ?? video?.videoData?.src}
			>
				{video?.videoBookmark?.src ?? video?.videoData?.src}
			</span>
		{/if}
		<div class="info-item">
			<span class="info-item timestamp">
				{format(
					video?.videoBookmark?.timestamp ??
						video?.videoData?.timestamp ??
						0
				)}
			</span>
			/
			<span class="info-item duration">
				{format(
					video?.videoBookmark?.duration ??
						video?.videoData?.duration ??
						0
				)}
			</span>
		</div>
	</div>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.c-video {
		width: 100%;
		background-color: a.$gray6;
		padding: 1rem;
		border-radius: 0.3rem;
		margin: 0.5rem 0;
		user-select: none;
		transition: all 0.1s;

		border-left: 0.2rem solid a.$copper-rose;

		cursor: pointer;

		&:hover {
			background-color: darken(a.$gray6, 4%);
		}
		&:active {
			transform: scale(0.99);
		}

		.c-infos {
			display: flex;
			justify-content: flex-start;
			flex-flow: column nowrap;
		}
		.info-item {
			font-size: 1.5rem;
		}
		.url,
		.src {
			font-size: 1.1rem;
		}
	}
</style>
