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
	let developerMode = false;
	function reload() {
		developerMode = sentio?.options.get('developer-mode') ?? false;
		optionValues = { ...sentio?.options.export() };
	}

	browser.runtime.getBackgroundPage().then(w => {
		sentio = w?.sentio;
		reload();
	});

	function onSubmit(): void {
		importInOptionManager();
		reload();
	}

	function onReset(): void {
		optionValues = { ...defaultOptions };

		importInOptionManager();
		reload();
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

	/** Clears the extension storage. _(Prompts user first via `confirm()`)_ */
	function clear() {
		if (
			!confirm(
				'Do you really want to clear the extension´s storage? This will not only clear all saved Options, but also all Video-Bookmarks.\nThis action cannot be undone.'
			)
		)
			return;

		sentio?.clear().finally(reload);
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
				column={!(
					typeof optionConfigs[option[0]]?.default === 'boolean'
				)}
				inputLeft={typeof optionConfigs[option[0]]?.default ===
					'boolean'}
			>
				<svelte:fragment slot="title"
					>{option[1].title}
					{#if developerMode}
						<br /><small
							>Key: <code class="select">{option[0]}</code></small
						>
					{/if}
				</svelte:fragment>
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
					{:else if typeof optionConfigs[option[0]]?.default === 'number' && typeof optionValues[option[0]] === 'number'}
						<input
							id={option[0]}
							bind:value={optionValues[option[0]]}
							type="number"
							min="0"
						/>
					{/if}
				</div>
			</FormItem>
		{/each}

		<div>
			<button type="submit">Save</button>
			<button type="reset">Reset</button>
			<button
				type="button"
				on:click={clear}
				title="This will clear all data, saved by Sentio.">Clear</button
			>
		</div>
	</form>
</div>
