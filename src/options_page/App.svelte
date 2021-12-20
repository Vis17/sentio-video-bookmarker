<script lang="ts">
	//#region imports
	import { fade, crossfade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { tweened } from 'svelte/motion';
	import * as e from 'svelte/easing';
	import { afterUpdate } from 'svelte';
	import Options from './Options.svelte';
	import Manage from './Manage.svelte';
	//#endregion

	enum Tab {
		'options' = 0,
		'manage' = 1,
	}
	let visibleTab: Tab = Tab['options'];

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

			<a href="#options" class="sidebar-item text-overflow no-select">
				<span>Options</span>
			</a>
			<a href="#manage" class="sidebar-item text-overflow no-select">
				<span>Manage Bookmarks</span>
			</a>
		</div>
		<div>
			<!-- bottom-items -->
		</div>
	</aside>

	<main>
		{#if visibleTab === Tab['options']}
			<div in:fade={{ duration: 300 }}>
				<Options />
			</div>
		{/if}

		{#if visibleTab === Tab['manage']}
			<div in:fade={{ duration: 300 }}>
				<Manage />
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

		border-right: 0.3rem solid a.$copper-rose;
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

			cursor: pointer;

			transition: all 0.3s;
			&:hover {
				background-color: a.$gray4;
			}
			&:active {
				letter-spacing: -0.1rem;
			}
		}
	}

	main {
		grid-area: main;
		background-color: a.$gray5;
		padding: 1rem;

		overflow: auto;
	}
</style>
