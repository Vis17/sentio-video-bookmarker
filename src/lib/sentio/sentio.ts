import ActivePage from './activePage';
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
}
