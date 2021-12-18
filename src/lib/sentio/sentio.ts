import ActivePage from './activePage';
import OptionsManager from './options/optionsManager';
import VideoBookmarkManager from './videoBookmarkManager';

export default class Sentio {
	private _videoBookmarks: VideoBookmarkManager;
	private _activePage: ActivePage;
	private _options: OptionsManager;

	constructor() {
		this._videoBookmarks = new VideoBookmarkManager();
		this._activePage = new ActivePage(this.videoBookmarks);
		this._options = new OptionsManager();

		this.load();
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

	save(): void {
		browser.storage.local.set({ data: this._videoBookmarks.export() });
		browser.storage.local.set({ options: this._options.export() });
	}
	async load(): Promise<void> {
		try {
			this.videoBookmarks.import(
				(await browser.storage.local.get('data'))?.['data']
			);
			this.options.import(
				(await browser.storage.local.get('options'))?.['options']
			);
		} catch (error) {
			// console.error(error);
		}
	}
}
