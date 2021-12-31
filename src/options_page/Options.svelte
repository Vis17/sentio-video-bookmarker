<script lang="ts">
	//#region imports
	import FormItem from '../components/FormItem.svelte';
	import optionConfigs, {
		arrayOfOptionConfigs,
		defaultOptions,
		OptionValuesMapped,
	} from '../lib/sentio/options/options';
	import Sentio from '../lib/sentio/sentio';
	//#endregion

	let sentio: Sentio | undefined;
	/**
	 * Should have the type `Partial<OptionValuesMapped>`, but there are errors
	 * in the binding, so I changed it to `any`
	 */
	let optionValues: any = {};

	browser.runtime.getBackgroundPage().then(w => {
		sentio = w?.sentio;
		optionValues = { ...sentio?.options.export() };
	});

	function onSubmit(): void {
		importInOptionManager();
	}

	function onReset(): void {
		optionValues = { ...defaultOptions };

		importInOptionManager();
	}

	function importInOptionManager(
		options?: Partial<OptionValuesMapped>
	): void {
		if (!options)
			return importInOptionManager(
				optionValues as Partial<OptionValuesMapped>
			);

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
			<FormItem
				name={option[0]}
				column={typeof optionConfigs[option[0]]?.default === 'string'}
			>
				<svelte:fragment slot="title">{option[1].title}</svelte:fragment
				>
				<svelte:fragment slot="description"
					>{option[1].description}</svelte:fragment
				>
				<div slot="input">
					{#if typeof optionConfigs[option[0]]?.default === 'boolean' && typeof optionValues[option[0]] === 'boolean'}
						<input
							id={option[0]}
							bind:checked={optionValues[option[0]]}
							type="checkbox"
						/>
					{:else if typeof optionConfigs[option[0]]?.default === 'string' && typeof optionValues[option[0]] === 'string'}
						<input
							id={option[0]}
							bind:value={optionValues[option[0]]}
							type="text"
						/>
					{/if}
				</div>
			</FormItem>
		{/each}

		<div>
			<button type="submit">Save</button>
			<button type="reset">Reset</button>
		</div>
	</form>
</div>
