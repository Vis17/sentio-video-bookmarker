import ActivePage from './activePage';
import ExportData from './exportData';
import OptionsManager from './options/optionsManager';
import VideoBookmarkManager from './videoBookmarkManager';

export default class Sentio {
	private _videoBookmarks: VideoBookmarkManager;
	private _activePage: ActivePage;
	private _options: OptionsManager;

	constructor() {
		this._options = new OptionsManager();
		this._videoBookmarks = new VideoBookmarkManager(this.options);
		this._activePage = new ActivePage(this.videoBookmarks, this.options);
	}

	get videoBookmarks() {
		return this._videoBookmarks;
	}
	get activePage() {
		return this._activePage;
	}
	get options() {
		return this._options;
	}

	async save(): Promise<void> {
		this._videoBookmarks.save();
		this._options.save();
	}
	async load(): Promise<void> {
		this._videoBookmarks.load();
		this._options.load();
	}
	/** Clear the extension´s storage */
	async clear() {
		await Promise.allSettled([
			this._videoBookmarks.clear(),
			this._options.clear(),
		]);

		// just make sure to clear really everything ;)
		return browser.storage.local.clear();
	}

	/** Export all important data, belonging to Sentio. */
	export(
		options?: { data: boolean; options: boolean },
		version?: string
	): ExportData {
		if (!options) return this.export({ data: true, options: true });
		if (!version) version = browser.runtime.getManifest().version ?? 'any';

		const exportedValues: ExportData = { version: version };
		if (options.data) exportedValues.data = this._videoBookmarks.export();
		if (options.options) exportedValues.options = this._options.export();

		return exportedValues;
	}
	/** Import all important data, belonging to Sentio. */
	import(data: ExportData): boolean {
		if (
			parseInt?.(data.version.split('.')?.[0]) >
			parseInt?.(browser.runtime.getManifest().version.split('.')?.[0])
		)
			return false;

		if (data.data) this._videoBookmarks.import(data.data, false);
		if (data.options) this._options.import(data.options, 'ignore');

		return true;
	}
}
