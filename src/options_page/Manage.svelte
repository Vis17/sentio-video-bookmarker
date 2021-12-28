<script lang="ts">
	//#region imports
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import VideoItem from '../components/VideoItem.svelte';
	import FormItem from '../components/FormItem.svelte';
	import Sentio from '../lib/sentio/sentio';
	import VideoBookmark, { VideoData } from '../lib/sentio/videoBookmark';
	import { format } from '../lib/puncto';
	//#endregion

	let videoBookmarks: VideoBookmark[] = [];
	let sentio: Sentio | undefined;
	let editVideo: VideoData;
	/** *Required to delete the old video bookmark if the src-attribute changes* */
	let oldSrc: string | undefined;
	let editReadOnlyProperties: boolean;
	let editExpanded = false;
	editReset();

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(w => {
			sentio = w.sentio;
		});
		videoBookmarks = [...(sentio?.videoBookmarks.query({}) ?? [])];
		editReadOnlyProperties =
			sentio?.options.get('edit-allow-read-only-properties') ?? false;
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

	function onclickVideoBookmark(e: CustomEvent<VideoData>) {
		editVideo = { ...e.detail };
		oldSrc = editVideo.src;

		editExpanded = true;
	}
	function editReset(): void {
		editVideo = {
			title: '',
			src: '',
			baseUrl: '',
			duration: 0,
			timestamp: 0,
		};
		oldSrc = undefined;

		editExpanded = false;
	}
	function editSubmit() {
		editExpanded = false;
		if (
			(editVideo &&
				sentio?.videoBookmarks.update(
					new VideoBookmark({ ...editVideo })
				)) ||
			!editVideo.src
		)
			return reload();

		if (oldSrc) sentio?.videoBookmarks.delete(oldSrc);
		sentio?.videoBookmarks.create({ ...editVideo });

		reload();
	}
</script>

<div class="wrapper">
	<div class="c-top">
		<h1>Manage Video Bookmarks</h1>

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
						on:click={onclickVideoBookmark}
					/>
				</div>
			{:else}
				<p>No Video-Bookmarks yet.</p>
			{/each}
		</div>
	</div>

	<div class="c-edit">
		<div
			on:click={() => (editExpanded = !editExpanded)}
			class="cursor-pointer no-select"
		>
			<h2>
				Edit Video Bookmark <small
					>{#if editExpanded}Click to collapse{:else}Click to expand{/if}</small
				>
			</h2>
		</div>
		{#if editExpanded}
			<form
				on:submit|preventDefault={editSubmit}
				on:reset|preventDefault={editReset}
			>
				<FormItem name="title">
					<svelte:fragment slot="title">Title</svelte:fragment>
					<input
						type="text"
						name="title"
						id="title"
						slot="input"
						bind:value={editVideo.title}
					/>
				</FormItem>
				<FormItem name="base-url">
					<svelte:fragment slot="title">URL</svelte:fragment>
					<svelte:fragment slot="description"
						>The URL the video was found on.</svelte:fragment
					>
					<input
						class="small"
						type="text"
						name="base-url"
						id="base-url"
						slot="input"
						bind:value={editVideo.baseUrl}
					/>
				</FormItem>
				<FormItem name="src">
					<svelte:fragment slot="title">Source</svelte:fragment>
					<svelte:fragment slot="description"
						>The source the video is loaded from. Used to identify
						the video.<br /><i
							>By editing this property a new VideoBookmark will
							be created!</i
						></svelte:fragment
					>
					<input
						class="small"
						type="text"
						name="src"
						id="src"
						slot="input"
						disabled={!editReadOnlyProperties}
						bind:value={editVideo.src}
					/>
				</FormItem>
				<FormItem name="timestamp">
					<svelte:fragment slot="title">Timestamp</svelte:fragment>
					<svelte:fragment slot="description"
						>The timestamp to which you have watched the video.</svelte:fragment
					>
					<div slot="input">
						<span class="time-formatted"
							>{format(editVideo.timestamp)}</span
						>
						<input
							type="number"
							name="timestamp"
							id="timestamp"
							bind:value={editVideo.timestamp}
							max={editVideo.duration}
							min="0"
						/>
					</div>
				</FormItem>
				<FormItem name="duration">
					<svelte:fragment slot="title">Duration</svelte:fragment>
					<svelte:fragment slot="description"
						>The duration of the video.</svelte:fragment
					>
					<div slot="input">
						<span class="time-formatted"
							>{format(editVideo.duration)}</span
						>
						<input
							type="number"
							name="duration"
							id="duration"
							disabled={!editReadOnlyProperties}
							bind:value={editVideo.duration}
						/>
					</div>
				</FormItem>

				<div>
					<button type="submit">Save</button>
					<button type="reset">Clear</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.wrapper {
		padding: 1rem;
		overflow: hidden;
		height: 100%;
		// max-height: 100%;

		display: grid;
		grid-template-areas:
			'video-bookmarks'
			'edit';
		grid-template-rows: 1fr auto;

		.c-top {
			grid-area: video-bookmarks;
			overflow: auto;

			.c-controls {
				@include a.flex-container(row);
			}

			.c-video-bookmarks {
				padding: 1rem;

				overflow: auto;
			}
		}

		.c-edit {
			grid-area: edit;

			padding: 1rem;
			background-color: a.$gray5;

			border-radius: 1rem;
			box-shadow: 0 0 1rem #000;

			.time-formatted {
				margin-right: 1rem;
			}
		}
	}
</style>
