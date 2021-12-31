<script lang="ts">
	import { onMount } from 'svelte';
	import { format } from '../lib/puncto';
	import Sentio from '../lib/sentio/sentio';
	import VideoBookmark, { type VideoData } from '../lib/sentio/videoBookmark';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let video:
		| { videoBookmark: VideoBookmark; videoData?: never }
		| { videoData: VideoData; videoBookmark?: never }
		| null;
	export let hasControls = false;
	export let defaultClickAction = true;
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
		dispatch(
			'click',
			video?.videoBookmark?.export() ?? video?.videoData ?? null
		);
		if (!defaultClickAction) return;

		if (video?.videoBookmark)
			return browser.tabs.create({ url: video.videoBookmark.baseUrl });

		if (video?.videoData)
			return sentio?.videoBookmarks.create(video.videoData);
	}

	function openThis() {
		if (video?.videoBookmark)
			browser.tabs.create({ url: video.videoBookmark.baseUrl ?? '' });
	}

	function deleteThis() {
		if (video?.videoBookmark)
			sentio?.videoBookmarks
				.delete(video.videoBookmark?.src)
				.finally(() => dispatch('reload-required'));
	}
</script>

<div class="c-video" on:dblclick={openThis} on:click={onClick}>
	<div class="c-data">
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
	{#if hasControls}
		<div class="c-controls">
			<div
				class="icon"
				on:click|stopPropagation={deleteThis}
				title="Delete this video-bookmark."
			>
				<img src="icons/trash.svg" alt="Trash" />
			</div>
			<div
				class="icon"
				on:click|stopPropagation={openThis}
				title="Open this video-bookmark.&#13;Protip: Double click the item to open."
			>
				<img src="icons/play.svg" alt="Play" />
			</div>
		</div>
	{/if}
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

		@include a.flex-container(row);
		gap: 1rem;

		&:hover {
			background-color: darken(a.$gray6, 2%);
		}
		&:active {
			padding-left: 0.7rem;
		}

		.c-data {
			width: 10rem;
			flex-grow: 1;

			.c-infos {
				display: flex;
				justify-content: flex-start;
				flex-flow: column nowrap;
				.info-item {
					font-size: 1.5rem;
				}
				.url,
				.src {
					font-size: 1.1rem;
				}
			}
		}

		.c-controls {
			@include a.flex-container();
			gap: 0.5rem;

			.icon {
				width: 4rem;
				height: 4rem;
				background-color: a.$gray4;
				border-radius: 0.4rem;

				transition: all 0.3s;

				&:hover {
					background-color: a.$gray5;
				}
				&:active img {
					padding: 0.8rem;
				}

				img {
					width: 100%;
					height: 100%;
					padding: 0.6rem;
				}
			}
		}
	}
</style>
