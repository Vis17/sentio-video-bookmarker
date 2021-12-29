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

		const permissionsToRequest = sentio?.options.import(options, 'ignore');
		if (permissionsToRequest)
			browser.permissions.request({
				permissions: [...permissionsToRequest],
			});
	}
</script>

<svelte:head>
	<title>Options | Sentio - Video-Bookmarker</title>
</svelte:head>

<div>
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
