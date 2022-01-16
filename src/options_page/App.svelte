<script lang="ts">
	//#region imports
	import { fade } from 'svelte/transition';
	import { afterUpdate } from 'svelte';
	import Options from './Options.svelte';
	import Manage from './Manage.svelte';
	import About from './About.svelte';
	//#endregion

	enum Tab {
		'options' = 0,
		'manage' = 1,
		'about' = 2,
	}
	let visibleTab: Tab = Tab['options'];
	const version = browser.runtime.getManifest().version ?? '-';

	function checkHash() {
		const hash = window.location.hash.substring(1);
		if (!Object.keys(Tab).includes(hash)) return;

		visibleTab = Tab[hash as keyof typeof Tab] ?? Tab['options'];
	}
	checkHash();

	// update hash
	afterUpdate(() => {
		window.location.hash = `#${Tab[visibleTab] ?? ''}`;
	});
</script>

<svelte:window on:hashchange={checkHash} />

<div class="wrapper">
	<aside class="sidebar">
		<div>
			<!-- top-items -->
			<img src="icons/icon.svg" alt="Logo" class="sidebar-logo" />

			<a
				href="#options"
				class="sidebar-item text-overflow no-select {visibleTab ===
				Tab['options']
					? 'active'
					: ''}"
			>
				<span>Options</span>
			</a>
			<a
				href="#manage"
				class="sidebar-item text-overflow no-select {visibleTab ===
				Tab['manage']
					? 'active'
					: ''}"
			>
				<span>Manage Bookmarks</span>
			</a>
		</div>
		<div>
			<!-- bottom-items -->
			<a
				href="#about"
				class="sidebar-item text-overflow no-select {visibleTab ===
				Tab['about']
					? 'active'
					: ''}"
			>
				<span>About</span>
			</a>
			<span
				class="sidebar-item no-onclick version text-overflow"
				title={`Version: ${version}`}>Version: <b>{version}</b></span
			>
		</div>
	</aside>

	<main>
		{#if visibleTab === Tab['options']}
			<div class="full-height" in:fade={{ duration: 300 }}>
				<Options />
			</div>
		{/if}

		{#if visibleTab === Tab['manage']}
			<div class="full-height" in:fade={{ duration: 300 }}>
				<Manage />
			</div>
		{/if}

		{#if visibleTab === Tab['about']}
			<div class="full-height" in:fade={{ duration: 300 }}>
				<About />
			</div>
		{/if}
	</main>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.wrapper {
		display: grid;
		grid-template-areas: 'sidebar main';
		grid-template-columns: clamp(5vw, 30rem, 25vw) 1fr;

		overflow: hidden;
		height: 100vh;
	}

	.sidebar {
		@include a.flex-container();

		height: 100vh;

		grid-area: sidebar;
		min-width: 10rem;

		background-color: a.$gray6;

		border-right: 0.3rem solid a.$black-coffee;
		box-shadow: 0.4rem 0 1rem #000;
		margin-right: 2rem;

		.sidebar-logo {
			padding: 3% 10%;
			width: 100%;
			height: auto;
		}
		.sidebar-item {
			padding: 1rem;
			margin: 0.2rem 0.5rem;
			border-radius: 0.2rem;
			display: block;
			color: a.$gray1;

			&:not(.no-onclick) {
				cursor: pointer;

				transition: all 0.3s;
				&:hover {
					background-color: a.$gray4;
				}
				&:active {
					letter-spacing: -0.1rem;
				}
			}

			&.version {
				text-align: center;
			}

			&.active {
				color: lighten(a.$copper-rose, 10);
				background-color: darken(a.$gray6, 2);
			}
		}
	}

	main {
		grid-area: main;
		background-color: a.$gray5;
		padding: 1rem;

		overflow: auto;

		.full-height {
			height: 100%;
		}
	}
</style>
