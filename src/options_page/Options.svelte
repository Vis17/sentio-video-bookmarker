<script lang="ts">
	//#region imports
	import FormItem from '../components/FormItem.svelte';
	import {
		arrayOfOptionConfigs,
		defaultOptions,
		OptionId,
		OptionValue,
	} from '../lib/sentio/options/options';
	import Sentio from '../lib/sentio/sentio';
	//#endregion

	let sentio: Sentio | undefined;
	browser.runtime.getBackgroundPage().then(w => {
		sentio = w?.sentio;
		optionValues = { ...sentio?.options.export() };
	});

	let optionValues: { [key in OptionId]?: OptionValue } = {};

	function onSubmit(): void {
		importInOptionManager();
	}

	function onReset(): void {
		optionValues = { ...defaultOptions };

		importInOptionManager();
	}

	function importInOptionManager(options?: {
		[key in OptionId]?: OptionValue;
	}): void {
		if (!options) return importInOptionManager(optionValues);

		sentio?.options.import(options, 'ignore');
	}
</script>

<div class="wrapper">
	<form on:submit|preventDefault={onSubmit} on:reset|preventDefault={onReset}>
		<h1>Options</h1>

		{#each arrayOfOptionConfigs as option}
			<FormItem name={option[0]} bind:checked={optionValues[option[0]]}>
				<svelte:fragment slot="title">{option[1].title}</svelte:fragment
				>
				<svelte:fragment slot="description"
					>{option[1].description}</svelte:fragment
				>
			</FormItem>
		{/each}

		<div>
			<button type="submit">Save</button>
			<button type="reset">Reset</button>
		</div>
	</form>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.wrapper {
		background-color: a.$gray6;
		width: clamp(80rem, 100rem, 90%);
		margin: 2rem auto;
		padding: 1rem;
		border-radius: 0.5rem;

		overflow: auto;
	}
</style>
