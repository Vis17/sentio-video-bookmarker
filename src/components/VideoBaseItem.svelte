<script lang="ts">
	import { format } from '../lib/puncto';
	import VideoBookmark, { type VideoData } from '../lib/sentio/videoBookmark';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let video: VideoBookmark | VideoData;
	export let hasControls = false;
	export let showBaseUrl = false;
	export let showScr = false;
</script>

<div
	class="c-video"
	on:dblclick={() => dispatch('dblclick')}
	on:click={() => dispatch('click')}
>
	<div class="c-data">
		<h2 class="text-overflow">{video.title ?? 'Just a video.'}</h2>
		<div class="c-infos">
			{#if showBaseUrl}
				<span
					class="info-item url text-overflow"
					title={video.baseUrl ?? 'Something went wrong.'}
				>
					{video.baseUrl ?? '# 404 #'}
				</span>
			{/if}
			{#if showScr}
				<span
					class="info-item src text-overflow"
					title={video.src ?? 'Something went wrong.'}
				>
					{video.src ?? '# 404 #'}
				</span>
			{/if}

			<div class="info-item">
				<span class="info-item timestamp">
					{format(video.timestamp ?? 0)}
				</span>
				/
				<span class="info-item duration">
					{format(video.duration ?? 0)}
				</span>
			</div>
		</div>
	</div>

	{#if hasControls}
		<div class="c-controls">
			<div
				class="icon"
				on:click|stopPropagation={() => dispatch('click-delete')}
				title="Delete this video-bookmark."
			>
				<img src="icons/trash.svg" alt="Trash" />
			</div>
			<div
				class="icon"
				on:click|stopPropagation={() => dispatch('click-play')}
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

		h2 {
			padding: 0;
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
