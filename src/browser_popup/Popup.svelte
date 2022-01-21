<script lang="ts">
	import { onMount } from 'svelte';
	import Sentio from '../lib/sentio/sentio';
	import VideoBookmark from '../lib/sentio/videoBookmark';
	import VideoBookmarkItem from '../components/VideoBookmarkItem.svelte';

	let videoBookmarks: VideoBookmark[] = [];
	let sentio: Sentio | undefined;

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(w => {
			sentio = w.sentio;
		});
		videoBookmarks = [...(sentio?.videoBookmarks.query({}) ?? [])];

		if (sentio?.options.get('page-auto-reload'))
			sentio?.activePage.reloadVideos();
	});

	function openOptions(): void {
		browser.runtime.openOptionsPage().catch(() => {
			// fallback
			browser.tabs.create({
				url: `options.html#options`,
			});
		});
	}

	function openManageMenu() {
		browser.tabs.create({
			url: `options.html#manage`,
		});
	}

	async function reload(): Promise<void> {
		// reload bookmarks from sentio
		videoBookmarks = [...(sentio?.videoBookmarks.query({}) ?? [])];

		// reload the videos on the page
		await sentio?.activePage.reloadVideos();
	}
</script>

<div class="popup">
	<header>
		<nav class="top-bar">
			<div class="top-bar-item no-select" on:click={reload}>
				<span>Reload</span>
			</div>
			<div class="top-bar-item no-select" on:click={openManageMenu}>
				<span>Manage</span>
			</div>
			<div class="top-bar-item no-select" on:click={openOptions}>
				<span>Options</span>
			</div>
		</nav>
	</header>

	<main>
		<h1>Video Bookmarks</h1>

		<div class="c-bookmarks">
			{#each videoBookmarks as x}
				<VideoBookmarkItem video={x} />
			{:else}
				<p class="p-no-videos highlight">No bookmarked videos yet.</p>
				<small>
					If you have already some bookmarked videos created, try to
					press the 'Reload' button or try to restart the browser
				</small>
			{/each}
		</div>
	</main>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;
	@use '../scss/layout/popup';

	.top-bar {
		@include a.flex-container(row, nowrap, space-around);
		align-items: center;
		gap: 0;

		border-bottom: 2px solid a.$copper-rose;
		box-shadow: 0 0.3rem 0.3rem darken(a.$gray6, 15);

		.top-bar-item {
			cursor: pointer;

			flex: 1 1 15rem;
			text-align: center;
			padding: 1rem 0;

			transition: all 0.3s;
			&:hover {
				letter-spacing: 0.1rem;
				background-color: a.$gray5;
			}
			&:active {
				letter-spacing: -0.1rem;
			}
		}
	}

	.c-bookmarks {
		padding: 1rem 0;
	}

	.p-no-videos {
		margin: 0.5rem 0;
	}
</style>
