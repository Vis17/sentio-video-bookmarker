<script lang="ts">
	import { onMount } from 'svelte';
	import Sentio from '../lib/sentio/sentio';
	import VideoDataList from '../components/VideoDataList.svelte';

	let sentio: Sentio | undefined;
	let videoBookmarkList: VideoDataList;

	onMount(async () => {
		await browser.runtime.getBackgroundPage().then(w => {
			sentio = w.sentio;
		});
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
		// reload the videos on the page
		await sentio?.activePage.reloadVideos();
		update();
	}

	function update() {
		videoBookmarkList.update();
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
		<VideoDataList
			list={{ type: 'video-bookmarks' }}
			bind:this={videoBookmarkList}
			on:reload-required={update}
		>
			<svelte:fragment slot="title">Video Bookmarks</svelte:fragment>
		</VideoDataList>
	</main>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.popup {
		padding: 0;
		width: 50rem;
		overflow-y: scroll;

		header {
			background-color: a.$gray6;

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
		}

		main {
			padding: 1.5rem;
		}
	}
</style>
