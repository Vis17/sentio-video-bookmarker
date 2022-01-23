<script lang="ts">
	import FormItem from '../components/FormItem.svelte';
	import ExportData from '../lib/sentio/exportData';
	import Sentio from '../lib/sentio/sentio';
	import downloadFile from '../lib/util/download';

	let sentio: Sentio | undefined;
	const version = browser.runtime.getManifest().version ?? 'any';
	const exportOptions = {
		options: true,
		data: true,
	};
	let importFiles: FileList;
	let importSuccess = false;

	browser.runtime.getBackgroundPage().then(w => {
		sentio = w?.sentio;
	});

	/** Clears the extension storage. _(Prompts user first via `confirm()`)_ */
	function clear() {
		if (
			!confirm(
				'Do you really want to clear the extension´s storage? This will not only clear all saved Options, but also all Video-Bookmarks.\nThis action cannot be undone.'
			)
		)
			return;

		sentio?.clear();
	}

	function exportData() {
		downloadFile(
			JSON.stringify(
				sentio?.export(
					{
						data: exportOptions.data,
						options: exportOptions.options,
					},
					version
				)
			),
			{ filename: 'sentio-data-export.json', type: 'application/json' }
		);
	}

	async function importData() {
		importSuccess = false;
		try {
			const data = JSON.parse(await importFiles[0].text());
			if (!ExportData.isValid(data)) throw 'Invalid data';

			if (!sentio?.import(data)) throw 'Importing error';

			importSuccess = true;
		} catch (err) {
			alert(
				'Smells like corrupt data. Sentio was not able to find a way to import these bytes.\nNothing happens, your old data remains (at least).'
			);
		}
	}
</script>

<svelte:head>
	<title>Storage | Sentio - Video-Bookmarker</title>
</svelte:head>

<div class="wrapper">
	<article>
		<h1>Manage Storage</h1>

		<section>
			<h2>Clear local storage</h2>
			<p>
				This will clear the local storage of the extension. All
				Video-Bookmarks and Options will be reset.
			</p>
			<button class="warning" on:click={clear}>Clear</button>
		</section>

		<section>
			<h2>Export</h2>

			<p>
				<b>Note:</b> Even if no option data is saved, either because you
				cleared it or because it was never saved, the default options
				are exported.<br />This is due to the data is getting exported
				from runtime and Sentio will use default options if nothing else
				was found.
			</p>

			<form on:submit|preventDefault={exportData}>
				<FormItem name="exportOptions-options" inputLeft={true}>
					<svelte:fragment slot="title"
						>Export Options</svelte:fragment
					>
					<input
						slot="input"
						type="checkbox"
						id="exportOptions-options"
						bind:checked={exportOptions.options}
					/>
				</FormItem>
				<FormItem name="exportOptions-videoBookmarks" inputLeft={true}>
					<svelte:fragment slot="title"
						>Export Video-Bookmarks</svelte:fragment
					>
					<input
						slot="input"
						type="checkbox"
						id="exportOptions-videoBookmarks"
						bind:checked={exportOptions.data}
					/>
				</FormItem>

				<div>
					<button type="submit">Export</button>
				</div>
			</form>
		</section>

		<section>
			<h2>Import</h2>

			<p>
				<b>Note:</b> Importing corrupt data can lead to unexpected behavior
				and to a loss of all saved data!
			</p>

			<form on:submit|preventDefault={importData}>
				<FormItem name="importFile" column={true}>
					<svelte:fragment slot="title"
						>Select the file to import from</svelte:fragment
					>
					<svelte:fragment slot="description">
						The file should be in <code>JSON</code> format. If you do
						not import a valid file, this can lead to unexpected behavior.
					</svelte:fragment>
					<input
						slot="input"
						type="file"
						id="importFile"
						accept=".json, application/json"
						bind:files={importFiles}
					/>
				</FormItem>

				<div>
					<button type="submit">Import</button>
				</div>

				{#if importSuccess}
					<p on:click={() => (importSuccess = false)}>
						Looks like the import worked...
					</p>
				{/if}
			</form>
		</section>
	</article>
</div>

<style lang="scss">
	@use '../scss/abstracts' as a;

	.wrapper {
		padding: 1rem;
	}
</style>
